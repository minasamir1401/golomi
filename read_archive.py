from app.core.database import SessionLocal
from app import models
from datetime import datetime

def read_archive():
    db = SessionLocal()
    try:
        # Fetch records, ordering by date (newest first) and then karat
        history = db.query(models.PriceHistory).order_by(
            models.PriceHistory.timestamp.desc(),
            models.PriceHistory.key.asc()
        ).limit(300).all() # Show last 300 records (approx 100 dates for 3 karats)

        with open("archive_view.txt", "w", encoding="utf-8") as f:
            f.write("=== GOLD PRICE ARCHIVE (PriceHistory Table) ===\n")
            f.write(f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("-" * 60 + "\n")
            f.write(f"{'Date & Time':<25} | {'Karat':<8} | {'Sell':<10} | {'Buy':<10} | {'Source':<15}\n")
            f.write("-" * 60 + "\n")
            
            for h in history:
                dt_str = h.timestamp.strftime("%Y-%m-%d %H:%M") if h.timestamp else "N/A"
                f.write(f"{dt_str:<25} | {h.key:<8} | {h.sell_price:<10} | {h.buy_price:<10} | {h.source_name}\n")
            
            total_count = db.query(models.PriceHistory).count()
            f.write("-" * 60 + "\n")
            f.write(f"Total records in archive: {total_count}\n")
            
        print(f"Archive successfully written to archive_view.txt (Showing latest {len(history)} records out of {total_count})")
    except Exception as e:
        print(f"Error reading archive: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    read_archive()
