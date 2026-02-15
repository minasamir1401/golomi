from app.core.database import SessionLocal
from app import models

db = SessionLocal()
count = db.query(models.PriceHistory).count()
print(f"Total historical records: {count}")

latest = db.query(models.PriceHistory).order_by(models.PriceHistory.timestamp.desc()).limit(5).all()
for l in latest:
    print(f"{l.timestamp} - {l.key}: {l.sell_price}")
db.close()
