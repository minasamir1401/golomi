import sqlite3
import json
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("database")

DB_NAME = "gold_prices.db"

def init_db():
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                data TEXT NOT NULL
            )
        ''')
        c.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        ''')
        # Initialize default settings if not exist
        defaults = {
            "scrape_interval": "60", # seconds
            "backup_interval": "600", # 10 mins
            "enabled_scrapers": json.dumps(["gold_era", "isagha", "sarf_today", "gold_live", "countries"]),
            "scraper_priority": json.dumps(["gold_live", "gold_era", "isagha"])
        }
        for k, v in defaults.items():
            c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', (k, v))
            
        conn.commit()
        conn.close()
        logger.info("Database and settings initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

def save_snapshot(data):
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        timestamp = datetime.now().isoformat()
        # Convert data to JSON string
        json_data = json.dumps(data, ensure_ascii=False)
        
        c.execute('INSERT INTO snapshots (timestamp, data) VALUES (?, ?)', (timestamp, json_data))
        conn.commit()
        conn.close()
        logger.info(f"✓ Data snapshot saved to DB at {timestamp}")
        return True
    except Exception as e:
        logger.error(f"Error saving snapshot: {e}")
        return False

def get_last_snapshot():
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('SELECT data FROM snapshots ORDER BY id DESC LIMIT 1')
        row = c.fetchone()
        conn.close()
        if row:
            return json.loads(row[0])
    except Exception as e:
        logger.error(f"Error getting last snapshot: {e}")
    return None

def update_setting(key, value):
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (key, str(value)))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Error updating setting {key}: {e}")
        return False

def get_settings():
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('SELECT key, value FROM settings')
        rows = c.fetchall()
        conn.close()
        return {row[0]: row[1] for row in rows}
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        return {}

def get_history(limit=168): # 1 week if hourly, but we do 10 mins now.
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('SELECT timestamp, data FROM snapshots ORDER BY id DESC LIMIT ?', (limit,))
        rows = c.fetchall()
        conn.close()
        return [{"timestamp": r[0], "data": json.loads(r[1])} for r in rows]
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        return []

def get_history_count():
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('SELECT COUNT(*) FROM snapshots')
        count = c.fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting history count: {e}")
        return 0
