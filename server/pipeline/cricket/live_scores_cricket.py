import requests
from bs4 import BeautifulSoup
import json
import time
import pathway as pw
from pathway.io.python import ConnectorSubject
from utils.cricket_parser import parse_cricket_matches

websites = "https://www.cricbuzz.com/"


def live_sports_data_json(website):

    dom = requests.get(website)

    with open("html_dom.html", "w") as f:
        f.write(dom.text)

    soup = BeautifulSoup(dom.text, "html.parser")
    cards = soup.find_all('li', class_='cb-view-all-ga cb-match-card cb-bg-white')
    
    cardContent = []


    for card in cards:
        cardContent.append(card.text)

    livedata = parse_cricket_matches(cardContent)
    return livedata

def scrape_cricbuzz(website_url, refresh_interval):
    with open('scraped_live_cricket.jsonl', 'w') as f:
        f.write('')

    while True:
        jsonDataSet = live_sports_data_json(website_url)
        for dataEntry in jsonDataSet:
                            
            url = website_url
            data = dataEntry
            metadata = {
                "url": url,
                "timestamp": time.time(),
            }
            
            yield {"url": url, "data": data, "metadata": dict(metadata)}

        time.sleep(refresh_interval)


class CricketScraperSubject(ConnectorSubject):

    def __init__(self, website_urls, refresh_interval):
        super().__init__()
        self._website_urls = website_urls
        self._refresh_interval = refresh_interval

    def run(self):
        for live_cricket_data in scrape_cricbuzz(
            self._website_urls,
            refresh_interval=self._refresh_interval,
        ):
            url = live_cricket_data["url"]
            data = live_cricket_data["data"]
            metadata = live_cricket_data["metadata"]

            self.next(url=url, data=data, metadata=metadata)

class ConnectorSchema(pw.Schema):
    url: str = pw.column_definition(primary_key=True)
    data: dict
    metadata: dict

subject = CricketScraperSubject(
    website_urls=websites,
    refresh_interval=25,
)

cricbuzz_results = pw.io.python.read(subject, schema=ConnectorSchema)

pw.io.jsonlines.write(cricbuzz_results, "scraped_live_cricket.jsonl")

pw.run()