from app.core.database import SessionLocal
from app import models
from sqlalchemy import func

db = SessionLocal()
# Get count of unique dates
unique_dates = db.query(func.count(func.distinct(func.date(models.PriceHistory.timestamp)))).scalar()
print(f"Unique dates in history: {unique_dates}")

# Get min and max dates
min_date = db.query(func.min(models.PriceHistory.timestamp)).scalar()
max_date = db.query(func.max(models.PriceHistory.timestamp)).scalar()
print(f"Date range: {min_date} to {max_date}")

db.close()
