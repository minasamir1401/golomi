import aiohttp
import asyncio
from bs4 import BeautifulSoup
import json
import logging
import re
import sqlite3
from datetime import datetime, timedelta
import database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def sqlite3_connect(db_name):
    return sqlite3.connect(db_name)

class GoldEraScraper:
    def __init__(self):
        self.base_url = "https://egypt.gold-era.com/ar/"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
        }
        # Initialize with empty data structure
        self.cache = {
            "prices": {},
            "products": {},
            "making_charges": [],
            "last_updated": datetime.now().isoformat(),
            "isagha": {},
            "countries": {},
            "sarf_currencies": [],
            "sarf_gold": {},
            "gold_live_history": [],
            "gold_live_currencies": [],
            "gold_live_prices": [],
            "gold_live_products": [],
            "gold_live_cards": []
        }
        self.last_save_time = None
        
        # Load last snapshot from database synchronously on init to provide immediate data
        last_snapshot = database.get_last_snapshot()
        if last_snapshot:
            self.cache.update(last_snapshot)
            logger.info("✓ Initialized cache from database snapshot.")

    async def fetch(self, session, url):
        try:
            async with session.get(url, headers=self.headers, timeout=15) as response:
                if response.status == 200:
                    return await response.read()
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
        return None

    async def scrape_prices(self, session):
        """Scrapes the main gold prices from Gold Era."""
        url = self.base_url + "سعر-الذهب/"
        content = await self.fetch(session, url)
        if not content: return False
        
        try:
            soup = BeautifulSoup(content, 'html.parser')
            prices = {}
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                    if len(cells) >= 3:
                        karat = cells[0]
                        if karat == "العيار": continue
                        
                        def clean_p(p):
                            return re.sub(r'[^\d.]', '', p.replace(',', ''))

                        sell = clean_p(cells[1])
                        buy = clean_p(cells[2])

                        if 'عيار' in karat:
                            prices[karat] = {"buy": buy, "sell": sell}
                        elif 'جنيه' in karat:
                            prices["gold_pound"] = {"buy": buy, "sell": sell}
                        elif 'أونصة' in karat:
                            prices["gold_ounce"] = {"buy": buy, "sell": sell}

            if prices:
                self.cache["prices"] = prices
                logger.info(f"✓ Gold Era Prices updated")
                return True
        except Exception as e:
            logger.error(f"Error parsing Gold Era prices: {e}")
        return False

    async def scrape_country_prices(self, session, country_slug):
        url = f"https://{country_slug}.gold-price-today.com/"
        content = await self.fetch(session, url)
        if not content: return None
        
        try:
            soup = BeautifulSoup(content, 'html.parser')
            data = {"current_prices": {}, "historical": [], "last_update": None}
            tables = soup.find_all('table')
            if tables:
                main_table = tables[0]
                rows = main_table.find_all('tr')
                for idx, row in enumerate(rows):
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 2:
                        texts = [col.get_text(strip=True) for col in cols]
                        if idx == 0 or 'الوحدة' in texts[0] or 'العيار' in texts[0]: continue
                        
                        name = texts[0]
                        sell_match = re.search(r'(\d+(?:\.\d+)?)', texts[1].replace(',', ''))
                        buy_match = re.search(r'(\d+(?:\.\d+)?)', texts[2].replace(',', '')) if len(texts) > 2 else sell_match
                        
                        if sell_match:
                            s_val = sell_match.group(1)
                            b_val = buy_match.group(1) if buy_match else s_val
                            if 'عيار' in name and any(k in name for k in ['24', '21', '18']):
                                karat_match = re.search(r'(\d+)', name)
                                karat = karat_match.group(1) if karat_match else "Unknown"
                                data["current_prices"][f"عيار {karat}"] = {"sell": s_val, "buy": b_val}
                            elif 'أونصة' in name:
                                data["current_prices"]["الأونصة"] = {"sell": s_val, "buy": b_val}
            return data
        except Exception as e:
            logger.error(f"Error parsing country {country_slug}: {e}")
        return None

    async def scrape_isagha_prices(self, session):
        url = "https://market.isagha.com/prices"
        content = await self.fetch(session, url)
        if not content: return False
        try:
            soup = BeautifulSoup(content, 'html.parser')
            data = {"gold": {}, "silver": {}}
            items = soup.find_all(['div', 'li'], class_=lambda x: x and ('card' in x.lower() or 'item' in x.lower()))
            for item in items:
                text = item.get_text(strip=True, separator=' ')
                if 'عيار' in text and 'بيع' in text:
                    k = re.search(r'عيار\s+(\d+)', text)
                    s = re.search(r'بيع\s+([\d,.]+)', text)
                    b = re.search(r'شراء\s+([\d,.]+)', text)
                    
                    if k:
                        val = {"sell": s.group(1).replace(',', '') if s else "0", "buy": b.group(1).replace(',', '') if b else "0"}
                        # Determine if it's gold or silver
                        if 'فضة' in text:
                            data["silver"][k.group(1)] = val
                        else:
                            data["gold"][k.group(1)] = val
            
            if data["gold"] or data["silver"]:
                self.cache["isagha"] = data
                return True
        except Exception as e:
            logger.error(f"Error scraping isagha: {e}")
        return False

    async def scrape_sarf_today_currencies(self, session):
        url = "https://sarf-today.com/currencies"
        content = await self.fetch(session, url)
        if not content: return False
        try:
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table', class_='local-cur')
            if table:
                currencies = []
                for row in table.find('tbody').find_all('tr'):
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 4:
                        name = cols[0].find('span').get_text(strip=True) if cols[0].find('span') else ""
                        code = cols[0].find('strong').get_text(strip=True).replace('(', '').replace(')', '') if cols[0].find('strong') else ""
                        if not code: continue
                        currencies.append({"name": name, "code": code, "buy": cols[2].get_text(strip=True), "sell": cols[3].get_text(strip=True)})
                self.cache["sarf_currencies"] = currencies
                return True
        except Exception: pass
        return False

    async def scrape_sarf_today_gold(self, session):
        url = "https://sarf-today.com/gold"
        content = await self.fetch(session, url)
        if not content: return False
        try:
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table', class_='local-cur')
            if table:
                prices = {}
                for row in table.find('tbody').find_all('tr'):
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 4:
                        name = cols[0].get_text(strip=True)
                        if "عيار" in name:
                            k_match = re.search(r'(\d+)', name)
                            k = k_match.group(1) if k_match else "Unknown"
                            prices[f"عيار {k}"] = {"buy": cols[2].get_text(strip=True).replace(',', ''), "sell": cols[3].get_text(strip=True).replace(',', '')}
                self.cache["sarf_gold"] = prices
                return True
        except Exception: pass
        return False

    async def scrape_gold_live_all(self, session):
        """Scrapes history, prices, and products from gold-price-live.com with precise selectors."""
        history_url = "https://gold-price-live.com/gold"
        market_url = "https://gold-price-live.com/market"
        
        ar_months = {
            "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "مايو": 5, "يونيو": 6,
            "يوليو": 7, "أغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12
        }

        def clean_val(val):
            if not val: return "0"
            # Remove everything except numbers and dots
            cleaned = re.sub(r'[^\d.]', '', val.replace(',', ''))
            return cleaned if cleaned else "0"

        def parse_ar_date(date_str):
            try:
                match = re.search(r'(\d+)\s+([\u0600-\u06FF]+)', date_str)
                if match:
                    day = int(match.group(1))
                    month_name = match.group(2)
                    month = ar_months.get(month_name)
                    if month:
                        current_year = datetime.now().year
                        parsed_date = datetime(current_year, month, day)
                        if parsed_date > datetime.now() + timedelta(days=7):
                             parsed_date = parsed_date.replace(year=current_year-1)
                        return parsed_date.strftime("%Y-%m-%d")
            except Exception:
                pass
            return date_str

        async def scrape_history_and_prices():
            content = await self.fetch(session, history_url)
            if not content: return
            soup = BeautifulSoup(content, 'html.parser')
            tables = soup.find_all('table')
            
            if len(tables) >= 3:
                # Table 0: General Prices / Products
                products = []
                rows = tables[0].find_all('tr')[1:] # Skip header
                for row in rows:
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 2:
                        products.append({
                            "name": cols[0].get_text(strip=True),
                            "price": clean_val(cols[1].get_text(strip=True)),
                            "weight": cols[2].get_text(strip=True) if len(cols) > 2 else ""
                        })
                if products:
                    self.cache["gold_live_products"] = products
                    logger.info(f"✓ Gold Price Live Products updated: {len(products)} items")

                # Table 1: History
                history = []
                rows = tables[1].find_all('tr')[1:]
                for row in rows:
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 8:
                        history.append({
                            "date": parse_ar_date(cols[0].get_text(strip=True)),
                            "karat_24": clean_val(cols[1].get_text(strip=True)),
                            "karat_22": clean_val(cols[2].get_text(strip=True)),
                            "karat_21": clean_val(cols[3].get_text(strip=True)),
                            "karat_18": clean_val(cols[4].get_text(strip=True)),
                            "karat_14": clean_val(cols[5].get_text(strip=True)),
                            "ounce": clean_val(cols[6].get_text(strip=True)),
                            "pound": clean_val(cols[7].get_text(strip=True))
                        })
                if history:
                    self.cache["gold_live_history"] = history
                    logger.info(f"✓ Gold Price Live History updated: {len(history)} rows")

                # Table 2: Buy/Sell Prices
                prices = []
                # Header check: ['العيار', 'بيع', 'شراء']
                rows = tables[2].find_all('tr')[1:]
                for row in rows:
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 3:
                        prices.append({
                            "name": cols[0].get_text(strip=True),
                            "sell": clean_val(cols[1].get_text(strip=True)),
                            "buy": clean_val(cols[2].get_text(strip=True))
                        })
                if prices:
                    self.cache["gold_live_prices"] = prices
                    logger.info(f"✓ Gold Price Live Prices updated: {len(prices)} items")

        async def scrape_homepage_cards():
            content = await self.fetch(session, "https://gold-price-live.com/")
            if not content: return
            soup = BeautifulSoup(content, 'html.parser')
            
            cards_data = []
            boxes = soup.find_all('div', class_='hover-me-box')
            for box in boxes:
                label_div = box.find('div', class_='home-specialization-header')
                value_div = None
                for div in box.find_all('div'):
                    classes = div.get('class', [])
                    if 'home-specialization-header' not in classes and any(c in classes for c in ['font-4', 'font-5', 'font-6', 'font-lg-5']):
                        value_div = div
                        break
                
                if label_div and value_div:
                    label = label_div.get_text(strip=True)
                    value_raw = value_div.get_text(strip=True, separator=' ')
                    nums = re.findall(r'[\d,]+', value_raw)
                    price = nums[-1].replace(',', '') if nums else "0"
                    
                    cards_data.append({
                        "id": label,
                        "label": label,
                        "price": price,
                        "unit": "EGP",
                        "url": "https://gold-price-live.com/gold"
                    })
            
            if cards_data:
                self.cache["gold_live_cards"] = cards_data
                logger.info(f"✓ Gold Price Live Homepage Cards updated: {len(cards_data)} items")

        async def scrape_live_market():
            content = await self.fetch(session, market_url)
            if not content: return
            soup = BeautifulSoup(content, 'html.parser')
            
            # If no table, look for list or cards
            currencies = []
            # Try to find currency labels in the whole page
            possible_items = soup.find_all(['div', 'tr', 'li'])
            for item in possible_items:
                text = item.get_text(strip=True)
                if any(c in text for c in ["الدولار", "اليورو", "الجنيه الإسترليني"]):
                    # Extract numbers
                    nums = re.findall(r'[\d.]+', text.replace(',', ''))
                    if len(nums) >= 2:
                        currencies.append({
                            "name": text.split('|')[0] if '|' in text else text[:20],
                            "buy": nums[0],
                            "sell": nums[1]
                        })
            
            if not currencies:
                # Fallback to homepage cards for common currencies
                for card in self.cache.get("gold_live_cards", []):
                    if "الدولار" in card['label']:
                        currencies.append({"name": card['label'], "buy": card['price'], "sell": card['price']})

            if currencies:
                # Filter duplicates and limit
                unique_curr = []
                seen = set()
                for c in currencies:
                    if c['name'] not in seen:
                        unique_curr.append(c)
                        seen.add(c['name'])
                self.cache["gold_live_currencies"] = unique_curr[:10]
                logger.info(f"✓ Gold Price Live Market updated: {len(unique_curr)} currencies")

        await asyncio.gather(scrape_history_and_prices(), scrape_homepage_cards(), scrape_live_market())

    async def seed_historical_archive(self):
        """Fetches 30 days of history and saves as individual snapshots if DB is empty."""
        logger.info("📅 Seeding historical archive from Gold Price Live...")
        
        ar_months = {
            "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "مايو": 5, "يونيو": 6,
            "يوليو": 7, "أغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12
        }

        def parse_ar_date(date_str):
            try:
                match = re.search(r'(\d+)\s+([\u0600-\u06FF]+)', date_str)
                if match:
                    day = int(match.group(1))
                    month_name = match.group(2)
                    month = ar_months.get(month_name)
                    if month:
                        current_year = datetime.now().year
                        parsed_date = datetime(current_year, month, day)
                        if parsed_date > datetime.now() + timedelta(days=7):
                             parsed_date = parsed_date.replace(year=current_year-1)
                        return parsed_date.strftime("%Y-%m-%dT23:59:59")
            except Exception:
                pass
            return datetime.now().isoformat()

        async with aiohttp.ClientSession() as session:
            content = await self.fetch(session, "https://gold-price-live.com/gold")
            if not content: return False
            soup = BeautifulSoup(content, 'html.parser')
            # The history table is the second table on the page
            tables = soup.find_all('table')
            if len(tables) < 2: return False
            table = tables[1]
            
            rows = table.find_all('tr')[1:]
            
            # We iterate in reverse to insert oldest first
            inserted_count = 0
            for row in reversed(rows):
                cols = row.find_all(['td', 'th'])
                if len(cols) >= 8:
                    raw_date = cols[0].get_text(strip=True)
                    timestamp = parse_ar_date(raw_date)
                    try:
                        mock_cache = self.cache.copy()
                        mock_cache["prices"] = {
                            "عيار 24": {"sell": cols[1].get_text(strip=True).replace(',', ''), "buy": cols[1].get_text(strip=True).replace(',', '')},
                            "عيار 22": {"sell": cols[2].get_text(strip=True).replace(',', ''), "buy": cols[2].get_text(strip=True).replace(',', '')},
                            "عيار 21": {"sell": cols[3].get_text(strip=True).replace(',', ''), "buy": cols[3].get_text(strip=True).replace(',', '')},
                            "عيار 18": {"sell": cols[4].get_text(strip=True).replace(',', ''), "buy": cols[4].get_text(strip=True).replace(',', '')},
                            "عيار 14": {"sell": cols[5].get_text(strip=True).replace(',', ''), "buy": cols[5].get_text(strip=True).replace(',', '')}
                        }
                        conn = sqlite3.connect(database.DB_NAME)
                        c = conn.cursor()
                        c.execute('INSERT OR IGNORE INTO snapshots (timestamp, data) VALUES (?, ?)', 
                                 (timestamp, json.dumps(mock_cache, ensure_ascii=False)))
                        conn.commit()
                        conn.close()
                        inserted_count += 1
                    except Exception as e:
                        logger.error(f"Error seeding row {raw_date}: {e}")
            logger.info(f"✓ Seeded {inserted_count} historical snapshots.")
            return True

    async def run_task_with_status(self, scraper_id, coro):
        self.cache["scraper_status"][scraper_id] = self.cache["scraper_status"].get(scraper_id, {})
        self.cache["scraper_status"][scraper_id].update({
            "status": "Running", 
            "last_start": datetime.now().isoformat()
        })
        
        start_time = datetime.now()
        try:
            result = await coro
            duration = (datetime.now() - start_time).total_seconds()
            
            # success criteria: result is True, or result is truthy data, or result is None (for void functions that logged success internally)
            # strictly speaking, scrape_prices returns boolean. scrape_country returns data. scrape_gold_live_all returns None.
            is_success = result is not False and result is not None
            
            # Special case for gold_live which returns None
            if scraper_id == "gold_live": is_success = True 
            # Special case for countries which returns None on fail
            if scraper_id.startswith("country_") and result is None: is_success = False

            if is_success:
                self.cache["scraper_status"][scraper_id].update({
                    "status": "Idle", 
                    "last_success": datetime.now().isoformat(),
                    "last_duration": duration,
                    "error": None
                })
            else:
                 self.cache["scraper_status"][scraper_id].update({
                     "status": "Failed", 
                     "last_error": "No data returned",
                     "last_duration": duration
                 })
        except Exception as e:
            duration = (datetime.now() - start_time).total_seconds()
            self.cache["scraper_status"][scraper_id].update({
                "status": "Error", 
                "last_error": str(e),
                "last_duration": duration
            })
            logger.error(f"Error in {scraper_id}: {e}")

    async def run_periodic_scrape(self):
        """Dynamic scraping loop controlled by database settings."""
        while True:
            # 1. Load current settings
            settings = database.get_settings()
            scrape_interval = int(settings.get("scrape_interval", 60))
            backup_interval = int(settings.get("backup_interval", 600))
            enabled_scrapers = json.loads(settings.get("enabled_scrapers", "[]"))
            
            logger.info(f"🚀 Scraping cycle started (Interval: {scrape_interval}s)...")
            start_time = datetime.now()
            
            self.cache["scraper_status"] = self.cache.get("scraper_status", {})

            async with aiohttp.ClientSession() as session:
                tasks = []
                if "gold_era" in enabled_scrapers:
                    tasks.append(self.run_task_with_status("gold_era", self.scrape_prices(session)))
                if "isagha" in enabled_scrapers:
                    tasks.append(self.run_task_with_status("isagha", self.scrape_isagha_prices(session)))
                if "sarf_today" in enabled_scrapers:
                    # Group sarf tasks? or track separately. Separately is better for granularity but user treated "sarf_today" as one toggle.
                    # We will wrap them in a single async def for status tracking
                    async def sarf_wrapper():
                        r1 = await self.scrape_sarf_today_currencies(session)
                        r2 = await self.scrape_sarf_today_gold(session)
                        return r1 or r2
                    tasks.append(self.run_task_with_status("sarf_today", sarf_wrapper()))
                if "gold_live" in enabled_scrapers:
                    tasks.append(self.run_task_with_status("gold_live", self.scrape_gold_live_all(session)))
                
                if "countries" in enabled_scrapers:
                    countries = ["egypt", "saudi-arabia", "united-arab-emirates", "kuwait", "qatar", "bahrain", "oman", "jordan", "iraq", "palestine", "lebanon", "yemen", "algeria", "morocco"]
                    
                    # Track countries as a group logic or individual? 
                    # Let's do a group wrapper for the "countries" status, but maybe log individuals internally if needed.
                    # For admin simple view, one status for "Arab Countries" is enough.
                    async def countries_wrapper():
                        success_count = 0
                        for c in countries:
                            data = await self.scrape_country_prices(session, c)
                            if data: 
                                self.cache["countries"][c] = data
                                success_count += 1
                        return success_count > 0
                    
                    tasks.append(self.run_task_with_status("countries", countries_wrapper()))

                if tasks:
                    await asyncio.gather(*tasks)

                # Sync Gold Live to main prices for chart compatibility
                if self.cache.get("gold_live_prices"):
                    for item in self.cache["gold_live_prices"]:
                        name = item.get("name", "")
                        # Standardize name for chart (remove 'ذهب ' prefix if exists)
                        std_name = name.replace("ذهب ", "").strip()
                        if std_name:
                            self.cache["prices"][std_name] = {
                                "sell": item.get("sell", "0"),
                                "buy": item.get("buy", "0")
                            }

            # Update cache timestamp
            self.cache["last_updated"] = datetime.now().isoformat()
            
            # Save to Database based on backup_interval
            current_time = datetime.now()
            if self.last_save_time is None or (current_time - self.last_save_time).total_seconds() >= backup_interval:
                logger.info("💾 Saving snapshot to database...")
                database.save_snapshot(self.cache)
                self.last_save_time = current_time
            
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"✨ Cycle completed in {duration:.2f}s. Sleeping for {scrape_interval}s...")
            await asyncio.sleep(scrape_interval)
