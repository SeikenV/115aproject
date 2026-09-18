import json
import os
import socket
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from httplib2 import Response
from requests import Request
from ServerToDatabase import DatabaseAccess
from ServerToOpenAI import VocabAI

script_path = os.path.abspath(__file__)
server_dir_path = os.path.dirname(script_path)
database_dir_path = os.path.dirname(server_dir_path) + "/database"
print("Server program location: ", script_path)
print("The server module is located in: ", server_dir_path)
print("The database module is located in: ", database_dir_path)

# Load environment variables from the .env file in the same directory
load_dotenv(dotenv_path=".env")

# Access the API key
api_key = os.getenv("OPENAI_API_KEY")


class Server:

    def __init__(self, client_socket, client_list, debug_mode=False):
        self.socket = client_socket
        self.Request = {
            "Method": None,
            "URI": None,
            "Version": None,
            "Headers": {},
            "Body": None,
        }
        self.Response = {
            "StatusCode": "503",
            "StatusLine": "Service Unavailable",
            "Version": "HTTP/1.1",
            "Headers": {},
            "Body": "",
        }
        self.activeAccount = set(client_list)
        self.username = ""
        self.debugMode = debug_mode

    """
    parse, compose, recv, and send are conventional socket programming methods. 
    """
    def parse_request(self, data):
        try:
            lines = data.split("\r\n")
            request_line = lines[0].split(" ")
            self.Request["Method"], self.Request["URI"], self.Request["Version"] = (
                request_line
            )

            headers = lines[1:-2]  # Skip the request line and the last line (body)
            for header in headers:
                key, value = header.split(": ")
                self.Request["Headers"][key] = value

            self.Request["Body"] = lines[-1]

            if self.debugMode:
                print(datetime.now(), " - Parsed Request:\n\n", self.Request)
        except Exception:
            self.Request = {
                "Method": None,
                "URI": None,
                "Version": None,
                "Headers": {},
                "Body": None,
            }

    def compose_response(self):
        response = (
            f"{self.Response['Version']} {self.Response['StatusCode']} {self.Response['StatusLine']}\r\n"
            + "".join(
                [
                    f"{key}: {value}\r\n"
                    for key, value in self.Response["Headers"].items()
                ]
            )
            + "\r\n"
            + self.Response["Body"]
        )

        if self.debugMode:
            print(datetime.now(), " - Composed Response:\n\n", response)

        return response

    def recv_request(self):
        request_data = b""
        while True:
            chunk = self.socket.recv(1024)
            request_data += chunk
            if len(chunk) < 1024:
                break  # Assume end of message if less than 1024 bytes received

        self.parse_request(request_data.decode("utf-8"))

    def send_response(self):
        response = self.compose_response()
        self.socket.sendall(response.encode("utf-8"))
        
    """
    retrieve functions pull data from external APIs, and will not change data in Database.
    """
    def retrieve_data(self):
        """
        Getter function for all database access. May consist sensitive data. Will not alter database.
        """
        self.Response["Headers"]["Access-Control-Allow-Origin"] = "*"
        target_db = self.Request["URI"]
        if target_db == "/userlist":  # get user login result
            username = self.Request["Headers"]["Username"]
            self.retrieve_login(username)
            if self.Response["StatusCode"] == "200":
                self.username = username
            else:
                self.Response["Body"] = "User already in session"

        elif target_db == "/progress":  # get user learned words
            self.username = self.Request["Headers"]["Username"]

            if self.Request["Headers"]["Target-Asset"] == "learned":
                self.retrieve_user_dict(self.username)
            elif self.Request["Headers"]["Target-Asset"] == "percentage":
                self.retrieve_user_percentage(self.username)

        elif target_db == "/total":
            self.username = self.Request["Headers"]["Username"]
            if "Target-Asset" in self.Request["Headers"]:
                self.retrieve_all_dict(self.Request["Headers"]["Target-Asset"])
            elif (
                "Target-Word" in self.Request["Headers"]
                and "Action" not in self.Request["Headers"]
            ):
                self.retrieve_translation(self.Request["Headers"]["Target-Word"])
            elif (
                "Target-Word" in self.Request["Headers"]
                and "Action" in self.Request["Headers"]
            ):
                self.retrieve_definition(self.Request["Headers"]["Target-Word"])
        elif target_db == "/chatgpt":
            self.username = self.Request["Headers"]["Username"]
            if "Action" in self.Request["Headers"]:
                if self.Request["Headers"]["Action"] == "fake":
                    self.retrieve_false_word()
                if self.Request["Headers"]["Action"] == "conversation":
                    self.retrieve_conversation()

    def retrieve_login(self, username):
        db_access = DatabaseAccess(database_dir_path)
        password = self.Request["Headers"]["Password"]
        result = db_access.request_login(username, password)

        if result == db_access.SUCCESSFUL:
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        elif result == db_access.USER_NAME_NOT_EXIST:
            self.Response["StatusCode"] = "404"
            self.Response["StatusLine"] = "Not Found"
        elif result == db_access.USER_PASSWORD_INVALID:
            self.Response["StatusCode"] = "403"
            self.Response["StatusLine"] = "Forbidden"
        else:
            pass

    def retrieve_user_dict(self, username):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        result = db_access.retrieve_user_data(username, language)
        if isinstance(result, dict):  # Check if result is a dictionary
            self.Response["Body"] = json.dumps(result)
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        else:  # Handle error codes
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"

    def retrieve_user_percentage(self, username):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        try:
            db_access.calculate_progress(self.username, language)
            result = db_access.retrieve_progress(self.username, language)
            self.Response["Body"] = json.dumps(dict({username: result}))
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        except Exception as e:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            print(f"An error occurred: {e}")

    def retrieve_all_dict(self, category=""):
        db_access = DatabaseAccess(database_dir_path)
        db_access.groupWordsByCategory()
        result = db_access.getAllWordsFromCategory(category)
        if isinstance(result, list):  # Check if result is a dictionary
            self.Response["Body"] = json.dumps(dict({category: result}))
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        else:  # Handle error codes
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"

    def retrieve_translation(self, word):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        try:
            result = db_access.get_translation(word, language)

            self.Response["Body"] = json.dumps(dict({word: result}))
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        except Exception as e:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            print(f"An error occurred: {e}")

    def retrieve_definition(self, word):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        try:
            result = db_access.get_definition(word)

            self.Response["Body"] = result
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        except Exception as e:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            print(f"An error occurred: {e}")

    def retrieve_false_word(self):
        word = self.Request["Headers"]["Target-Word"]
        language = self.Request["Headers"]["Game-Language"]
        try:
            ai = VocabAI()
            self.Response["Body"] = ai.getFalseWord(language=language, word=word)
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "text/plain"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        except Exception as e:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            print(f"An error occurred: {e}")

    def retrieve_conversation(self):
        word = self.Request["Headers"]["Target-Word"]
        category = self.Request["Headers"]["Target-Asset"]
        language = self.Request["Headers"]["Game-Language"]
        try:
            ai = VocabAI()
            result = ai.getConversation(
                username=self.username, language=language, category=category, word=word
            )

            self.Response["Body"] = json.dumps(dict({word: result}))
            self.Response["Headers"]["Content-Length"] = str(len(self.Response["Body"]))
            self.Response["Headers"]["Content-Type"] = "application/json"
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        except Exception as e:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            print(f"An error occurred: {e}")

    """
    update functions are used to write to database. Use with cautions. 
    """
    def update_data(self):
        """
        Setter function for all database access. May consist sensitive data. Will alter database.
        """
        self.Response["Headers"]["Access-Control-Allow-Origin"] = "*"
        self.username = self.Request["Headers"]["Username"]
        if self.Request["URI"] == "/userlist":
            self.update_create_account()
        elif self.Request["URI"] == "/progress":
            # if self.username in self.activeAccount:
            #     self.update_user_dictionary(self.username)
            # else:
            #     self.Response["Body"] = "User not in session"
            self.update_user_dictionary(self.username)
        else:
            pass

    def update_create_account(self):
        username = self.Request["Headers"]["Username"]
        password = self.Request["Headers"]["Password"]
        db_access = DatabaseAccess(database_dir_path)
        result = db_access.add_new_user(username, password)
        if result == db_access.SUCCESSFUL:
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        elif result == db_access.USER_CONFLICT:
            self.Response["StatusCode"] = "409"
            self.Response["StatusLine"] = "Conflict"
        elif result == db_access.USER_PASSWORD_INVALID:
            self.Response["StatusCode"] = "406"
            self.Response["StatusLine"] = "Not Acceptable"

    def update_user_dictionary(self, username):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        new_data = json.loads(self.Request["Body"])
        if not isinstance(new_data, dict):
            if db_access.update_user_dictionary(username, language, new_data):
                self.Response["StatusCode"] = "200"
                self.Response["StatusLine"] = "OK"
            else:
                self.Response["StatusCode"] = "500"
                self.Response["StatusLine"] = "Internal Server Error"
                self.Response["Body"] = "update_user_dictionary() failed"

    """
    toggle functions are alternatives to update funcstion. They are used when the user only updates one field in the database. 
    """
    def toggle_data(self):
        """
        Quick access function to database. Should not consist sensitive data. Database will only be altered in a specific field.
        """
        self.Response["Headers"]["Access-Control-Allow-Origin"] = "*"
        self.username = self.Request["Headers"]["Username"]
        if self.Request["URI"] == "/progress":
            action = self.Request["Headers"]["Action"]
            if action == "learn":
                self.toggle_learn(self.username)
            elif action == "proficiency up":
                self.toggle_proficiency(self.username, 1)
            elif action == "proficiency down":
                self.toggle_proficiency(self.username, -1)

    def toggle_learn(self, username):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        new_words = str(self.Request["Body"])
        result = db_access.learn_new_word(username, language, new_words)
        if result == db_access.SUCCESSFUL:
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        else:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            self.Response["Body"] = "learn_new_words() failed"

    def toggle_proficiency(self, username, change):
        db_access = DatabaseAccess(database_dir_path)
        language = self.Request["Headers"]["Game-Language"]
        word = str(self.Request["Body"])
        result = db_access.alter_proficiency(username, language, word, change)
        if result == db_access.SUCCESSFUL:
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
        else:
            self.Response["StatusCode"] = "500"
            self.Response["StatusLine"] = "Internal Server Error"
            self.Response["Body"] = "alter_proficiency() failed"

    """
    Dispatcher for server jobs. 
    """
    def process_request(self):
        if self.Request["Method"] == "GET":
            if self.debugMode:
                print("Retrive request received")
            self.retrieve_data()
        elif self.Request["Method"] == "POST":
            if self.debugMode:
                print("Update request received")
            self.update_data()
        elif self.Request["Method"] == "PUT":
            if self.debugMode:
                print("Toggle request received")
            self.toggle_data()
        elif self.Request["Method"] == "OPTIONS":
            self.Response["StatusCode"] = "200"
            self.Response["StatusLine"] = "OK"
            self.Response["Headers"]["Access-Control-Allow-Origin"] = "*"
            self.Response["Headers"][
                "Access-Control-Allow-Methods"
            ] = "GET, POST, PUT, OPTIONS"
            self.Response["Headers"][
                "Access-Control-Allow-Headers"
            ] = "Content-Type, Content-Length, Username, Password, Game-Language, Action, Target-Asset, Target-Word"
            self.Response["Headers"]["Access-Control-Max-Age"] = "86400"
            self.Response["Headers"]["Content-Length"] = "0"
            self.Response["Headers"]["Connection"] = "close"
        else:
            self.Response["StatusCode"] = "501"
            self.Response["StatusLine"] = "Not Implemented"

    '''
    Entry point for Server instance. 
    '''
    def run(self):
        state = "RECV"
        while True:
            if state == "RECV":
                self.recv_request()
                state = "PROCESS"
            elif state == "PROCESS":
                # Process the request here
                self.process_request()
                state = "SEND"
            elif state == "SEND":
                response = self.compose_response()
                self.socket.sendall(response.encode("utf-8"))
                state = "CLOSE"
            elif state == "CLOSE":
                self.socket.shutdown(socket.SHUT_RDWR)
                # self.socket.close()
                break
            else:  # invalid state
                break

        return self.username


# Test main function
if __name__ == "__main__":

    test_request = """\
GET /user-account HTTP/1.1\r\n\
Host: www.vocabventure.com\r\n\
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n\
Content-Length: 27\r\n\
Content-Type: application/x-www-form-urlencoded\r\n\
Connection: keep-alive\r\n\
\r\n\
name=John&age=30&city=New+York\
"""

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server = Server(server_socket, "", debug_mode=True)
    server.parse_request(test_request)
