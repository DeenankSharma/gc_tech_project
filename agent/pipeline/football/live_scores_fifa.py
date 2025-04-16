from bs4 import BeautifulSoup
import json
import time
import pathway as pw
from pathway.io.python import ConnectorSubject
from pipeline.football.utils.fifa_parser import parse_fifa_matches
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from smolagents import tool

class ConnectorSchema(pw.Schema):
    """
    Schema definition for the FIFA data pipeline.
    
    This schema defines the structure of the data flowing through
    the Pathway pipeline, including primary keys and field types.
    
    Attributes:
        url (str): The URL of the scraped website, used as the primary key.
        data (dict): The parsed FIFA match data.
        metadata (dict): Additional information about the scraping process.
    """
    url: str = pw.column_definition(primary_key=True)
    data: dict
    metadata: dict

def live_sports_data_json(website):
    """
    Scrape live FIFA match data from the specified website and convert it to structured format.
    
    This function uses Selenium to render JavaScript content from the website,
    extracts FIFA match information using BeautifulSoup, and returns structured data after parsing.
    
    Args:
        website (str): URL of the ESPN football website to scrape data from.
        
    Returns:
        list: List of dictionaries containing parsed FIFA match information.
    """
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)
    
    driver.get(website)
    dom = driver.page_source
    
    with open("html_dom.html", "w") as f:
        f.write(dom)
    
    driver.quit()
    
    soup = BeautifulSoup(dom, "html.parser")
    cards = soup.find_all(
        'div',
        class_='ScoreboardScoreCell pa4 FIFA.WORLDQ.AFC soccer ScoreboardScoreCell--post ScoreboardScoreCell--tabletPlus'
    )
    
    cardContent = [card.get_text() for card in cards]
    
    livedata = parse_fifa_matches(cardContent)
    return livedata

def scrape_espn(website_url, refresh_interval):
    """
    Continuously scrape FIFA data from ESPN at specified intervals.
    
    This generator function repeatedly retrieves FIFA match data, filters out
    previously seen entries, and yields new data with metadata.
    
    Args:
        website_url (str): URL of the ESPN football website to scrape data from.
        refresh_interval (int): Time in seconds to wait between scraping attempts.
        
    Yields:
        dict: A dictionary containing the URL, scraped data, and metadata for new FIFA match entries.
    """
    indexed_set = set()
    
    while True:
        jsonDataSet = live_sports_data_json(website_url)
        for dataEntry in jsonDataSet:
            dataEntryStr = json.dumps(dataEntry, sort_keys=True)
            if dataEntryStr in indexed_set:
                continue
            
            metadata = {
                "url": website_url,
                "timestamp": time.time(),
            }
            
            indexed_set.add(dataEntryStr)
            yield {
                "url": website_url,
                "data": dataEntry,
                "metadata": metadata,
            }
        
        time.sleep(refresh_interval)

class FifaScraperSubject(ConnectorSubject):
    """
    A Pathway connector subject for scraping FIFA match data.
    
    This class manages the process of scraping FIFA match information
    and feeding it into a Pathway data pipeline.
    
    Args:
        website_urls (str): URL of the ESPN football website to scrape data from.
        refresh_interval (int): Time in seconds to wait between scraping attempts.
    """
    def __init__(self, website_urls, refresh_interval):
        super().__init__()
        self._website_urls = website_urls
        self._refresh_interval = refresh_interval
    
    def run(self):
        """
        Execute the FIFA data scraping process.
        
        This method retrieves FIFA match data continuously and
        passes it to the Pathway connector for processing.
        """
        for live_football_data in scrape_espn(
            self._website_urls,
            refresh_interval=self._refresh_interval,
        ):
            self.next(
                url=live_football_data["url"],
                data=live_football_data["data"],
                metadata=live_football_data["metadata"]
            )

@tool
def football_live_scores_pipeline(
    website_url: str = "https://www.espn.in/football/scoreboard/_/league/fifa.worldq.afc",
    refresh_interval: int = 25,
    output_file: str = "scraped_live_fifa.jsonl"
)->None:
    """
    Create and run a data pipeline for scraping live FIFA football scores.
    
    This function sets up a complete Pathway pipeline that scrapes FIFA match
    data from the specified ESPN website at regular intervals and writes the results
    to a JSONL file. It uses Selenium for rendering JavaScript content and
    BeautifulSoup for HTML parsing.
    
    Args:
        website_url (str, optional): URL of the ESPN football website to scrape.
            Defaults to "https://www.espn.in/football/scoreboard/_/league/fifa.worldq.afc".
        refresh_interval (int, optional): Time in seconds to wait between
            scraping attempts. Defaults to 25.
        output_file (str, optional): Path to the output JSONL file.
            Defaults to "scraped_live_fifa.jsonl".
    
    Returns:
        None: The function runs the pipeline until manually interrupted.
    """
    subject = FifaScraperSubject(
        website_urls=website_url,
        refresh_interval=refresh_interval,
    )
    
    espn_results = pw.io.python.read(subject, schema=ConnectorSchema)
    pw.io.jsonlines.write(espn_results, output_file)
    
    pw.run()