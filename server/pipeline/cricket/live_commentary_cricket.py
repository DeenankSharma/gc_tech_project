import requests
import json
import time
from bs4 import BeautifulSoup
import pathway as pw
from pathway.io.python import ConnectorSubject
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

website = "https://www.cricbuzz.com/cricket-match/live-scores"

options = Options()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)

ROOT_URL = "https://www.cricbuzz.com"

def fetch_live_commentary_urls(website):

    dom = requests.get(website)

    with open("html_dom.html", "w") as f:
        f.write(dom.text)

    soup = BeautifulSoup(dom.text, "html.parser")


    cards = soup.find_all('a', title='Full Commentary')
    
    activeUrls = []


    for card in cards:
        activeUrls.append(ROOT_URL + card.get('href'))

    return activeUrls

# actieveUrls = fetch_live_commentary_urls(website)
# print("active urls: ", actieveUrls)

def fetch_commentary(website):

    activeUrls = fetch_live_commentary_urls(website)
    # print("active urls: ", activeUrls)

    if not activeUrls:
        print("No active commentary URLs found.")
        return

    commentaryList = []
    for activeUrl in activeUrls:
        driver.get(activeUrl)
        print("Driver at the url: ", activeUrl)
        dom = driver.page_source

        print("Fetched DOM")


        with open("html_dom.html", "w") as f:
            f.write(dom)

        soup = BeautifulSoup(dom, "html.parser")
        cards = soup.find_all('p', class_='cb-com-ln ng-binding ng-scope cb-col cb-col-90')

        print("number of cards: ", len(cards))
        


        for commentary in cards:
            commentaryList.append({"url": activeUrl, "data": commentary.text})

    return commentaryList


# commentary = fetch_commentary(website)
# print("commentary: ", commentary)

def scrape_cricbuzz_commentary(website_url, refresh_interval):
    print("Scraping live cricket commentary from:", website_url)
    indexed_set = set() 

    while True:
        print("Fetching commentary data...")
        commentaryList = fetch_commentary(website_url)
        print(commentaryList[0])
        for commentary in commentaryList:
            dataEntryStr = json.dumps(commentary, sort_keys=True)
            if dataEntryStr in indexed_set:
                continue
                            
            url = commentary["url"]
            data = commentary["data"]
            metadata = {
                "url": url,
                "timestamp": time.time(),
            }
            
            indexed_set.add(dataEntryStr)
            print({"url": url, "data": data, "metadata": dict(metadata)})
            yield {"url": url, "data": data, "metadata": dict(metadata)}

        time.sleep(refresh_interval)

# a = scrape_cricbuzz_commentary(website, refresh_interval=25)
# for b in a :
#     print(b)

class CommentaryScraperSubject(ConnectorSubject):

    def __init__(self, website_urls, refresh_interval):
        super().__init__()
        self._website_urls = website_urls
        self._refresh_interval = refresh_interval

    def run(self):
        for live_cricket_commentary in scrape_cricbuzz_commentary(
            self._website_urls,
            refresh_interval=self._refresh_interval,
        ):
            url = live_cricket_commentary["url"]
            data = live_cricket_commentary["data"]
            metadata = live_cricket_commentary["metadata"]

            self.next(url=url, data=data, metadata=metadata)

class ConnectorSchema(pw.Schema):
    url: str = pw.column_definition(primary_key=True)
    data: dict
    metadata: dict

subject = CommentaryScraperSubject(
    website_urls=website,
    refresh_interval=25,
)

cricbuzz_results = pw.io.python.read(subject, schema=ConnectorSchema)

pw.io.jsonlines.write(cricbuzz_results, "scraped_live_commentary.jsonl")

pw.run()