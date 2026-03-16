from pymongo import MongoClient

class MongoHandler:
    def __init__(self, connection_string, db_name):
        """
        Initializes the connection to MongoDB.
        """
        # Create a MongoClient to the running instance
        self.client = MongoClient(connection_string)
        # Access the specific database
        self.db = self.client[db_name]

    def __enter__(self):
        # This runs when you enter the 'with' block
        self.client = MongoClient(self.connection_string)
        self.db = self.client[self.db_name]
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # This runs automatically when you leave the block
        if self.client:
            self.client.close()
            print("🔌 MongoDB connection closed.")

    def get_documents(self, collection_name, query={}):
        """
        Retrieves documents matching the query from the specified collection.
        Returns a list of documents.
        """
        # Use find() to search for documents in the collection
        collection = self.db[collection_name]
        return list(collection.find(query))

    def delete_document(self, collection_name, query):
        """
        Deletes a single document matching the query.
        """
        # Use delete_one() to remove a single document
        collection = self.db[collection_name]
        return collection.delete_one(query)

    def insert_document(self, collection_name, data):
        """
        Inserts a single document (dictionary) into the specified collection.
        """
        # Use insert_one() to add a document
        collection = self.db[collection_name]
        return collection.insert_one(data)

    def upsert_document(self, collection_name, query, data):
        """
        Updates a document if it exists, otherwise inserts it.
        """
        collection = self.db[collection_name]
        return collection.update_one(query, {"$set": data}, upsert=True)
    def close_connection(self):
        """
        Closes the connection to MongoDB.
        """
        self.client.close()

    def create_index(self, collection_name, field_name):
        """
        Creates a unique index on the specified field.
        """
        self.db[collection_name].create_index([(field_name, 1)], unique=True)
