import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

ROOT_URL = "https://www.cricbuzz.com/cricket-match/live-scores"

options = Options()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)

def fetch_live_commentary_urls(website):

    dom = requests.get(website)

    with open("html_dom.html", "w") as f:
        f.write(dom.text)

    soup = BeautifulSoup(dom.text, "html.parser")


    cards = soup.find_all('a', title='Full Commentary')
    
    activeUrls = []


    for card in cards:
        activeUrls.append("https://www.cricbuzz.com" + card.get('href'))

    return activeUrls

def fetch_commentary(website):

    activeUrls = fetch_live_commentary_urls(website)
    print(activeUrls)

    if not activeUrls:
        print("No active commentary URLs found.")
        return

    driver.get(activeUrls[0])
    dom = driver.page_source


    with open("html_dom.html", "w") as f:
        f.write(dom)

    driver.quit()

    soup = BeautifulSoup(dom, "html.parser")
    cards = soup.find_all('p', class_='cb-com-ln ng-binding ng-scope cb-col cb-col-90')

    print("number of cards: ", len(cards))
    
    commentaryList = []


    for commentary in cards:
        commentaryList.append(commentary.text)

    return commentaryList

commentaryList = fetch_commentary(ROOT_URL)
print(commentaryList)