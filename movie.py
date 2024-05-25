import requests
import json
from bs4 import BeautifulSoup

# URL to scrape
url = "https://letterboxd.com/esieeyen/films/by/rated-date/size/large/"

# Headers to mimic a browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
}

# Send a GET request to the URL with headers
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find the container with class 'poster-list -p150 -grid film-list clear'
    container = soup.find('ul', class_='poster-list -p150 -grid film-list clear')
    
    movies = []
    
    # Iterate through the first 14 items in the container
    for item in container.find_all('li')[:14]:
        # Find the title from the alt attribute of the image
        title = item.find('img')['alt']
        
        # Find the div with the 'data-film-link' attribute
        film_div = item.find('div', attrs={'data-film-link': True})
        if film_div:
            link = "https://letterboxd.com" + film_div['data-film-link']
        else:
            link = None
            print("wala")

        # Find all <span> tags with various rating classes within the current item
        rating_spans = item.find_all('span', class_=lambda value: value and value.startswith('rating rated-'))
        
        # If any rating span is found, append the mapped rating, title, and link to the movies list
        for span in rating_spans:
            rating_value = int(span['class'][1].split('-')[-1])
            # Map rating_value to the desired rating_text
            if rating_value == 2:
                rating_text = 6
            elif rating_value == 4:
                rating_text = 7
            elif rating_value == 6:
                rating_text = 8
            elif rating_value == 8:
                rating_text = 9
            elif rating_value == 10:
                rating_text = 10
            
            # Append the rating, title, and link to the list
            movies.append({"rating": rating_text, "title": title, "link": link})
    
    # Write movies to a JSON file
    with open("movies.json", "w") as f:
        json.dump(movies, f, indent=4)
        
    print("JSON file created successfully!")
else:
    print("Failed to retrieve the page.")
