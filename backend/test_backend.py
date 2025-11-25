import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

try:
    print("Importing database...")
    from database import db
    print("Database imported successfully.")
    
    print("Testing database connection...")
    stats = db.get_dashboard_stats()
    print(f"Dashboard stats: {stats}")
    
    print("Importing main...")
    from main import app
    print("Main imported successfully.")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
