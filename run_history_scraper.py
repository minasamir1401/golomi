import asyncio
import logging
from app.core.database import SessionLocal
from app.scraper.history_scraper import scrape_all_historical_periods

logging.basicConfig(level=logging.INFO)

async def main():
    db = SessionLocal()
    try:
        total = await scrape_all_historical_periods(db)
        print(f"Finished seeding. Total new records: {total}")
    except Exception as e:
        print(f"FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
