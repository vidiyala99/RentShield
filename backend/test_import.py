import sys
import os
sys.path.append(os.getcwd())
try:
    from app.main import app
    print("SUCCESS: app.main imported")
except ImportError as e:
    print(f"FAILURE: {e}")
except Exception as e:
    print(f"ERROR: {e}")
