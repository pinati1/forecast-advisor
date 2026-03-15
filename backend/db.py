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

