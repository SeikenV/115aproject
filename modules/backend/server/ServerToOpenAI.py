import json
import os
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from ServerToDatabase import DatabaseAccess

script_path = os.path.abspath(__file__)
server_dir_path = os.path.dirname(script_path)
database_dir_path = os.path.dirname(server_dir_path) + "/database"


class VocabAI:
    def __init__(self):
        # Load environment variables from the .env file in the same directory
        load_dotenv(dotenv_path=".env")

        # Access the API key
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key)

    def getFalseWord(self, language, word):
        db_access = DatabaseAccess(database_dir_path)
        translated = db_access.get_translation(word, language)
        print(translated)
        role_str = f"You are an examiner. You are making multiple choice question for the word {translated}."
        prompt_str = f"""Please create 4 {language} words close to {translated}. 
The generated words should be resemble to {translated}, and should mean diferrent or mean nothing.
Your words' length should be close, so that the examinee would know a hint. Ensure that you provide 4 words and no more or less. Do not put {translated} in the list. 
Follow the format of <word><\\n><word><\\n><word><\\n><word>, all lower case. """
        try:
            completion = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": role_str,
                    },
                    {
                        "role": "user",
                        "content": prompt_str,
                    },
                ],
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def getConversation(self, username, language, category, word):
        db_access = DatabaseAccess(database_dir_path)
        translated = db_access.get_translation(word, language)
        role_text = f"""You are in an RPG game, speaking English and {language}. You are an villager who teachs words about {category}."
            "You are willing to teach words in your language, {language}, to me"""

        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": role_text},
                {
                    "role": "user",
                    "content": f"Assume I am native in English. I am to learn your language. Pretend you are an viliger, and write a paragraph to teach me the word {translated} in English",
                },
            ],
        )
        return completion.choices[0].message.content


if __name__ == "__main__":
    test = VocabAI()
    # word = test.getFalseWord("spanish", "white")
    # print(word)
    convo = test.getConversation(
        language="spanish", username="mdong", category="animals", word="cat"
    )
    print(convo)
