from bs4 import BeautifulSoup
import json
import time
import pathway as pw
from pathway.io.python import ConnectorSubject
from utils.fifa_parser import parse_fifa_matches
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

websites = "https://www.espn.in/football/scoreboard/_/league/fifa.worldq.afc"

options = Options()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)


def live_sports_data_json(website):

    driver.get(website)
    dom = driver.page_source

    with open("html_dom.html", "w") as f:
        f.write(dom)

    soup = BeautifulSoup(dom, "html.parser")
    cards = soup.find_all('div', class_='ScoreboardScoreCell pa4 FIFA.WORLDQ.AFC soccer ScoreboardScoreCell--post ScoreboardScoreCell--tabletPlus')
    
    cardContent = []


    for card in cards:
        cardContent.append(card.get_text())

    livedata = parse_fifa_matches(cardContent)
    return livedata


def scrape_espn(website_url, refresh_interval):
    indexed_set = set() 

    while True:
        jsonDataSet = live_sports_data_json(website_url)
        for dataEntry in jsonDataSet:
            dataEntryStr = json.dumps(dataEntry, sort_keys=True)
            if dataEntryStr in indexed_set:
                continue
                            
            url = website_url
            data = dataEntry
            metadata = {
                "url": url,
                "timestamp": time.time(),
            }
            
            indexed_set.add(dataEntryStr)
            yield {"url": url, "data": data, "metadata": dict(metadata)}

        time.sleep(refresh_interval)


class FifaScraperSubject(ConnectorSubject):

    def __init__(self, website_urls, refresh_interval):
        super().__init__()
        self._website_urls = website_urls
        self._refresh_interval = refresh_interval

    def run(self):
        for live_football_data in scrape_espn(
            self._website_urls,
            refresh_interval=self._refresh_interval,
        ):
            url = live_football_data["url"]
            data = live_football_data["data"]
            metadata = live_football_data["metadata"]

            self.next(url=url, data=data, metadata=metadata)

class ConnectorSchema(pw.Schema):
    url: str = pw.column_definition(primary_key=True)
    data: dict
    metadata: dict

subject = FifaScraperSubject(
    website_urls=websites,
    refresh_interval=25,
)

espn_results = pw.io.python.read(subject, schema=ConnectorSchema)

pw.io.jsonlines.write(espn_results, "scraped_live_fifa.jsonl")

pw.run()