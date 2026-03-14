from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os


MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "surf_forecast")


client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo() -> None:
  global client, db

  if client is not None:
      return

  client = AsyncIOMotorClient(MONGO_URL)
  db = client[MONGO_DB_NAME]


async def close_mongo_connection() -> None:
  global client

  if client is not None:
      client.close()
      client = None

