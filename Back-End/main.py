from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scraper import GoldEraScraper
import database
import asyncio
import json
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Dict

# Models for Admin Control
class SettingUpdate(BaseModel):
    key: str
    value: str

# Define lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    database.init_db()
    # Start the periodic scraper
    asyncio.create_task(scraper.run_periodic_scrape())
    yield

app = FastAPI(title="Gold Era Scraper API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scraper = GoldEraScraper()

@app.get("/")
async def root():
    return {"status": "running", "message": "Gold Era Scraper API is active"}

# --- Public Endpoints ---
@app.get("/api/prices")
async def get_prices():
    return scraper.cache["prices"]

@app.get("/api/products")
async def get_products():
    return scraper.cache["products"]

@app.get("/api/making-charges")
async def get_making_charges():
    return scraper.cache["making_charges"]

@app.get("/api/isagha")
async def get_isagha():
    return scraper.cache["isagha"]

@app.get("/api/countries")
async def get_all_countries():
    return scraper.cache["countries"]

@app.get("/api/countries/{country_slug}")
async def get_country_prices(country_slug: str):
    return scraper.cache["countries"].get(country_slug, {})

@app.get("/api/sarf-currencies")
async def get_sarf_currencies():
    return scraper.cache.get("sarf_currencies", [])

@app.get("/api/sarf-gold")
async def get_sarf_gold():
    return scraper.cache.get("sarf_gold", {})

@app.get("/api/gold-live-history")
async def get_gold_live_history():
    return scraper.cache.get("gold_live_history", [])

@app.get("/api/gold-live-currencies")
async def get_gold_live_currencies():
    return scraper.cache.get("gold_live_currencies", [])

@app.get("/api/gold-live-prices")
async def get_gold_live_prices():
    return scraper.cache.get("gold_live_prices", [])

@app.get("/api/gold-live-products")
async def get_gold_live_products():
    return scraper.cache.get("gold_live_products", [])

@app.get("/api/gold-live-cards")
async def get_gold_live_cards():
    return scraper.cache.get("gold_live_cards", [])

@app.get("/api/history")
async def get_price_history(days: int = 7):
    # limit calculation: if snapshot every 10 mins, that's 6 per hour, 144 per day
    limit = days * 144
    return database.get_history(limit=limit)

# --- Admin / Settings Endpoints ---
@app.get("/api/admin/settings")
async def get_admin_settings():
    return database.get_settings()

@app.post("/api/admin/settings")
async def update_admin_setting(setting: SettingUpdate):
    success = database.update_setting(setting.key, setting.value)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update setting")
    return {"status": "success", "key": setting.key}

@app.get("/api/admin/stats")
async def get_admin_stats():
    return {
        "cache_last_updated": scraper.cache.get("last_updated"),
        "db_snapshots_count": database.get_history_count(),
        "scraper_status": scraper.cache.get("scraper_status", {})
    }

@app.get("/api/admin/raw-cache")
async def get_raw_cache():
    # Dangerous! Only for admin debugging
    return scraper.cache

@app.post("/api/admin/seed-archive")
async def seed_archive():
    success = await scraper.seed_historical_archive()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to seed archive")
    return {"status": "success", "message": "Historical archive seeded successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
