import json
import pymongo  
import os
from pathlib import Path
from dotenv import load_dotenv
from db import MongoHandler
from models.beach import Beach

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
json_path = base_dir / "data" / "beaches.json"

load_dotenv(dotenv_path=env_path)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME")
print(MONGO_URL, DB_NAME)

def seed_beaches():
    if not json_path.exists():
        print(f"❌ Error: File not found at {json_path}")
        return

    handler = MongoHandler(MONGO_URL, DB_NAME)
    
    
    handler.create_index("beaches", "name")

    
    print("🌍 Creating 2dsphere index on 'geometry' field...")
    try:
        handler.db["beaches"].create_index([("geometry", pymongo.GEOSPHERE)])
        print("✅ 2dsphere index created successfully!")
    except Exception as e:
        print(f"❌ Error creating geospatial index: {e}")

    
    with open(json_path, 'r', encoding='utf-8') as f:
        beach_list = json.load(f)

    for beach_data in beach_list:
        try:
            beach_obj = Beach(**beach_data)
            
            
            handler.upsert_document(
                collection_name="beaches", 
                query={"name": beach_obj.name}, 
                data=beach_obj.model_dump() 
            )
            
            print(f"✅ Successfully seeded/updated: {beach_obj.name}")
            
        except Exception as e:
            print(f"❌ Error seeding {beach_data.get('name')}: {e}")

    handler.close_connection()
    print("\n🎉 Database seeding complete!")

if __name__ == "__main__":
    seed_beaches()