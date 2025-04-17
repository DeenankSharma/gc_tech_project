from .mongodb_connection import messages_collection
from datetime import datetime

def store_message_from_db(email, message_content, is_user, title=None):
    """
    Store a message in the database.
    
    Args:
        email (str): The email identifier for the user
        message_content (str): The message text
        is_user (bool): Whether the message is from the user (True) or system (False)
        title (str, optional): The title for the chat session
        
    Returns:
        bool: True if successful, False otherwise
    """
    if not messages_collection:
        print("Database connection not established")
        return False
    
    # Check if a document for this email already exists
    existing_doc = messages_collection.find_one({"email": email})
    
    current_time = datetime.now().strftime("%I:%M:%S %p")  # Format: hh:mm:ss AM/PM
    
    new_message = {
        "isUser": is_user,
        "message": message_content,
        "date": current_time
    }
    
    if existing_doc:
        update_data = {"$push": {"messages": new_message}}
        
        if title and not existing_doc.get("title"):
            update_data["$set"] = {"title": title}
            
        result = messages_collection.update_one(
            {"email": email},
            update_data
        )
        return result.modified_count > 0
    else:
        new_doc = {
            "email": email,
            "messages": [new_message],
            "title": title
        }
        result = messages_collection.insert_one(new_doc)
        return result.inserted_id is not None

def get_messages_from_db(email):
    """
    Retrieve all messages for a specific email.
    
    Args:
        email (str): The email to retrieve messages for
        
    Returns:
        list: List of message objects or empty list if none found
    """
    if not messages_collection:
        print("Database connection not established")
        return []
    
    doc = messages_collection.find_one({"email": email})
    if doc and "messages" in doc:
        return doc["messages"]
    return []

def get_title_from_db(email):
    """
    Retrieve just the title for a specific email.
    
    Args:
        email (str): The email to retrieve the title for
        
    Returns:
        str: The title or None if not found
    """
    if not messages_collection:
        print("Database connection not established")
        return None
    
    doc = messages_collection.find_one({"email": email}, {"title": 1})
    if doc and "title" in doc:
        return doc["title"]
    return None

def get_all_chat_sessions():
    """
    Retrieve all chat sessions with their email and title.
    
    Returns:
        list: List of dictionaries with email and title
    """
    if not messages_collection:
        print("Database connection not established")
        return []
    
    sessions = messages_collection.find({}, {"email": 1, "title": 1})
    return list(sessions)