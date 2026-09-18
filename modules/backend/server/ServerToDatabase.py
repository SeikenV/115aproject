import firebase_admin
import os
import threading
from datetime import datetime
import random
from firebase_admin import credentials
from firebase_admin import firestore
from collections import defaultdict

class DatabaseAccess:

    DB_ERROR = -1
    DB_EMPTY = ""
        
    SUCCESSFUL = 0
    USER_NAME_NOT_EXIST = 1
    USER_PASSWORD_INCORRECT = 2
        
    USER_CONFLICT = 1
    USER_PASSWORD_INVALID = 2

    ALREADY_LEARNED_WORD = -1


    def __init__(self, script_path):
        # Current timestamp in a compact format
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        # Generate a random integer
        random_number = random.randint(1000, 9999)

        # Format the unique name with thread ID, timestamp, and random number
        self.unique_name = f"firebaseApp-{threading.current_thread().ident}-{timestamp}-{random_number}"
        # print(f"Firebase instance {unique_name} created")
        self.cred = credentials.Certificate(script_path + '/cfg/dbaccess.json')
        self.firebase_app  = firebase_admin.initialize_app(self.cred, name=self.unique_name)
        self.db = firestore.client(self.firebase_app)

        #the collection we are under is the users collection on Firestore
        self.collection_name = 'users'

        self.categoryData = defaultdict(list)
        print(datetime.now(), f" - Firebase App: {self.unique_name} created")
        

    def __del__(self):
        # Clean up Firebase app on object destruction
        firebase_admin.delete_app(self.firebase_app)
        print(datetime.now(), f" - Firebase App: {self.unique_name} deleted")

        
    def request_login(self, username, password):
        """
        This function checks the given username and password against the entries
        in the 'userlist' table of a MongoDB database. If the credentials match
        an existing entry, it returns some form of success indicator, otherwise
        it fails.

        - param1 username: The username as a string.
        - param2 password: The password as a string.
        - return: 0 for success, 1 for user not exits, 2 for incorrect password, -1 for internal failure.
        """
        #obtain a reference to the respective document on Firestore containing the user data
        user_ref = self.db.collection(self.collection_name).document(username)
        user_doc = user_ref.get()

        # If the document exists, compare the password
        if user_doc.exists:
            user_data = user_doc.to_dict()
            if isinstance(user_data, dict) and user_data['password'] == password:
                # Passwords match
                print("Passwords match!")
                return 0
            else:
                # Passwords do not match
                print("Passwords do not match, incorrect password")
                return 2
        else:
            # Username not found, the user does not exist
            print("You are not registered as a user, please create an account")
            return 1


    def add_new_user(self, username, password):
        """
        - param1 username: The username as a string.
        - param2 password: The password as a string.
        - return: 0 for success, 1 for user already exits, 2 for invalid password format, -1 for internal failure.
        """
        #passwords have to be strings, if not they are invalid passwords
        if not isinstance(password, str):
            print("Invalid password format, passwords need to be strings")
            return 2
        
        #obtain reference to the document on Firestore
        doc_ref = self.db.collection(self.collection_name).document(username)
        doc = doc_ref.get()

        #check if a document already exists, if so the user has already been registered
        if doc.exists:
            print(f"Document '{username}' already exists.")
            return 1
        #otherwise register the user
        else:
            doc_ref.set({"password":password})
            doc_ref.update({"french": {}})
            doc_ref.update({"spanish":{}})
            doc_ref.update({"french_progress": "0%"})
            doc_ref.update({"spanish_progress": "0%"})
            print(f"New document '{username}' created.")
            return 0
    
    def learn_new_word(self, username, language, learnedWord):
        doc_ref = self.db.collection(self.collection_name).document(username)
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            #print("This is the data:", data)
            if data is not None and learnedWord in data[language]:
                print("Word already has been learned by user")
                return self.SUCCESSFUL #return successful status code even if word is already learned
            field_value = doc.get(language)
            #print("This is the type:", type(field_value))
            field_value[learnedWord] = 5
            doc_ref.update({language: field_value})
            return self.SUCCESSFUL
        else:
            return self.USER_NAME_NOT_EXIST

    def update_user_status(self, username, status):
        """
        This function update the database about whether a user is online. 

        - param1 username: The username as a string.
        - param2 status: The log in status (online or offline) as a boolean.
        - return: 0 for success, -1 for internal failure which will force client to logout.
        """
        try:
            user_ref = self.db.collection('users').document(username)
            user_ref.update({'online_status': status})
            return self.SUCCESSFUL  
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return self.DB_ERROR 
    
    def retrieve_user_data(self, username, language):
        """
        Retrieve a user's learned words along with their associated values for both French and Spanish.

        :param username: The username of the user.
        :return: A dictionary containing the 'french' and 'spanish' fields with learned words and values, or None for internal failure.
        """
        try:
            # Get the user document from the users collection
            user_ref = self.db.collection('users').document(username)
            user_doc = user_ref.get()

            if not user_doc.exists:
                print(f"No data exist for the user with username {username}.")
                return None

            # Extract data from the document
            user_data = user_doc.to_dict()
            if user_data is None:
                print(f"Failed to convert user document to dictionary for username {username}.")
                return None

            # Initialize empty dictionaries for French and Spanish to handle possible missing fields
            french_learned_words = {}
            spanish_learned_words = {}

            # Check for the presence of 'french' and 'spanish' fields explicitly
            if 'french' in user_data:
                french_learned_words = user_data['french']
            if 'spanish' in user_data:
                spanish_learned_words = user_data['spanish']

            # Prepare the learned data dictionary
            learned_data = {
                'french': french_learned_words,
                'spanish': spanish_learned_words,
            }

            return learned_data[language]

        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def get_translation(self, word, language):
        """
        Retrieve the translation of an English word for the specified language.
    
        :param word: The English word to translate.
        :param language: The target language ('french' or 'spanish').
        :return: The translation of the word or None if not found or in case of an error.
        """
        try:
            # Reference to the document containing the word's translations
            word_ref = self.db.collection('totalWords').document(word)
            word_doc = word_ref.get()

            if not word_doc.exists:
                print(f"No translation found for the word: {word}")
                return None

            # Extract the word data
            word_data = word_doc.to_dict()
        
            # Check and return the translation based on the specified language
            translation = word_data.get(language)
            if translation:
                return translation
            else:
                print(f"No translation available for the word: '{word}' in the language: '{language}'.")
                return None

        except Exception as e:
            print(f"An error occurred while retrieving the translation: {e}")
            return None
    
    def get_definition(self, word):
        #input param is just word, since the definition retrieved is just in english
        #input is just the English word
        try:
            # Reference to the document containing the word's translations
            word_ref = self.db.collection('totalWords').document(word)
            word_doc = word_ref.get()

            if not word_doc.exists:
                print(f"No translation found for the word: {word}")
                return None

            # Extract the word data
            word_data = word_doc.to_dict()
        
            # Check and return the translation based on the specified language
            definition = word_data.get('definition')
            if definition:
                return definition
            else:
                print(f"There is no definition for the word.")
                return None

        except Exception as e:
            print(f"An error occurred while retrieving the translation: {e}")
            return None


    def update_user_dictionary(self, username, language, new_dict):
        """
        Advanced method to change a word's proficiency number to the user's learned list for a specified language.

        - param username: The username of the user.
        - param language: The language being learned.
        - param new_dict: The dictionary contains all words to be altered with their key as new proficiency value. Create if word not learned. 
        - return: true for success, false for failure
        """
        pass
        
    def alter_proficiency(self, username, language, word, action):
        """
        Toggle a word's proficiency value by 1.

        - param username: The username of the user.
        - param language: The language being learned.
        - param word: The word to be altered. 
        - param action: can be 'up' or 'down'
        """

        #for ease of functionality we can make action equal to 1 or -1 for increment
        #or decrement respectively, and just append that value to the current proficiency
        #level
        doc_ref = self.db.collection(self.collection_name).document(username)
        doc = doc_ref.get()
        if doc.exists:
            field_value = doc.get(language)
            #print("This is the type:", type(field_value))
            
            #only update if it is within the bounds
            if 0 < (field_value[word] + action) < 10:
                field_value[word] = field_value[word] + action
            doc_ref.update({language: field_value})
            return self.SUCCESSFUL
        else:
            return self.USER_NAME_NOT_EXIST
    

    def groupWordsByCategory(self):
        #groups words by category in a python dictionary called self.categoryData
        collection_ref = self.db.collection("totalWords")
        docs = collection_ref.stream()

        for doc in docs:
            if doc.exists:  # Check if the document exists
                data = doc.to_dict()
                if data is not None:  # Check if the document data is not None
                    category = data.get('category', 'No category field')
                    self.categoryData[category].append(doc.id)
                else:
                    category = 'Document data is None'
            else:
                category = 'Document does not exist'
        
            #print(f'Document ID: {doc.id}, Category: {category}')
    def getAllWordsFromCategory(self, categoryName):
        #returns a list of all of the words in a given category
        return self.categoryData[categoryName]


    
    def calculate_progress(self, username, language):
        """
        Calculates and updates the user's current progress in a desired language

        - param username: The username of the user.
        - param language: The language being learned.

        """
          
        collection_ref = self.db.collection(self.collection_name)
        doc_ref = self.db.collection(self.collection_name).document(username)
        doc = doc_ref.get()
        if doc.exists:
            #get the number of keys in the desired dictionary
            dictionary = doc.get(language)
            learned_words = len(dictionary.keys())
            docs = collection_ref.stream()
    
            # Count the documents
            count = sum(1 for _ in docs)
            progress = ((learned_words/count) * 100)
            rounded_prog = round(progress, 2)
            str_progress = str(rounded_prog) + "%"
            str_progresskey = language + "_" + "progress"
            print(str_progresskey)
            doc_ref.update({str_progresskey: str_progress})
            return self.SUCCESSFUL
        else:
            return self.USER_NAME_NOT_EXIST
    

    #function to retrieve progress percentage
    def retrieve_progress(self, username, language):
        collection_ref = self.db.collection(self.collection_name)
        doc_ref = self.db.collection(self.collection_name).document(username)
        doc = doc_ref.get()
        if doc.exists:
        # Extract the value of the field 'french_progress
            data = doc.to_dict()
            if data is not None:  # Check if the document data is not None
                language_str = language + "_" + "progress"
                progress = data.get(language_str, 'No category field')
                return progress
        else:
            return self.USER_NAME_NOT_EXIST


        
if __name__ == '__main__':
    script_path = os.path.abspath(__file__)
    server_dir_path = os.path.dirname(script_path)
    print("This is the directory path:", os.path.dirname(server_dir_path))
    database_dir_path = os.path.dirname(server_dir_path) + "/database"
    test = DatabaseAccess(database_dir_path)

    #test.groupWordsByCategory()
    #print(test.getAllWordsFromCategory("occupations"))
    #print(test.retrieve_progress('TestApril232ndUser', 'french'))
    #print(test.learn_new_word('TestApril232ndUser', 'french', 'testword55'))

    #print(test.get_translation('bird', 'spanish'))
    print(test.get_definition('stadium'))




    