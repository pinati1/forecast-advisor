import json
import asyncio
from db import MongoHandler
from models.beach import Beach
import os
from pathlib import Path
from dotenv import load_dotenv


base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"

# 2. Load the specific .env file
load_dotenv(dotenv_path=env_path)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME")
print(MONGO_URL, DB_NAME)

def seed_beaches():
    handler = MongoHandler(MONGO_URL, DB_NAME)
    # --- Example Usage ---
# handler = MongoHandler("mongodb://localhost:27017/", "my_database")
# handler.insert_document("users", {"name": "Alice", "age": 30})
# users = handler.get_documents("users", {"name": "Alice"})
# handler.delete_document("users", {"name": "Alice"})


    with open('./data/beaches.json', 'r') as f:
        beach_list = json.load(f)

    for beach_data in beach_list:
        try:
            beach_obj = Beach(**beach_data)
            handler.insert_document("beaches", beach_obj.model_dump())
            print(f"✅ Successfully seeded: {beach_obj.name}")
            
        except Exception as e:
            print(f"❌ Error seeding {beach_data.get('name')}: {e}")

    print("\nDatabase seeding complete!")

if __name__ == "__main__":
    seed_beaches()