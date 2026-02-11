import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re

async def test_country(country_slug):
    url = f"https://{country_slug}.gold-price-today.com/"
    print(f"Testing URL: {url}")
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            print(f"Status: {response.status}")
            if response.status == 200:
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')
                tables = soup.find_all('table')
                if tables:
                    print(f"Found {len(tables)} tables")
                    main_table = tables[0]
                    rows = main_table.find_all('tr')
                    for idx, row in enumerate(rows[:5]):
                        cols = row.find_all(['td', 'th'])
                        print(ascii([c.get_text(strip=True) for c in cols]))
                else:
                    print("No tables found")
            else:
                print("Failed to fetch")

if __name__ == "__main__":
    asyncio.run(test_country("palestine"))
