/**
 * Class containing VocabVenture Client API. Each function creates a dedicated client. Implemented functions:
 * 
 * validateUser(username, password);
 * addNewUser(username, password);
 * getUserDictionary(username, language);
 * updateUserDictionary(username, language, word, proficiency = 5);
 * learnNewWord(username, language, word);
 * upProficiency(username, language, word);
 * downProficiency(username, language, word);
 * getAllWordsByCategory(username, category);
 * getTranslation(username, language, word);
 * getDefinition(username, language, word);
 * getQuestionWord(username, language, difficulty); generate one word based on user's proficiency/mastery
 * getMultipleChoice(username, language, word); generates four words for MC question in the format [correct index, four words in a list]
 */
class GameClient {
    // Private fields
    // #HOST = '149.28.199.169';
    #HOST = '45.63.84.166'; // high-performance
    // #HOST = '127.0.0.1';
    #PORT = 8080;
    #DEBUG = false;

    userTable = '/userlist';
    userProgress = '/progress';
    allDict = '/total';
    ai = "/chatgpt";

    constructor() {
        this.baseURL = `http://${this.#HOST}:${this.#PORT}`;
        this.spanish = {};
        this.french = {};
        this.definition = {};
        this.userData = {};
        // Call the async initialization method
        this.init();
    }

    async init() {
        this.spanish = {};
        this.french = {};
        this.definition = {};
        const colors = await this.getAllWordsByCategory("client", "colors");
        const school = await this.getAllWordsByCategory("client", "school");
        const food = await this.getAllWordsByCategory("client", "food");
        const clothing = await this.getAllWordsByCategory("client", "clothing");
        this.colors = colors["colors"];
        this.school = school['school'];
        this.food = food['food'];
        this.clothing = clothing['clothing'];
        // console.log("colors: ", this.colors);
        const allWords = [...this.colors, ...this.school, ...this.food, ...this.clothing];
        for (const word of allWords) {
            let sp_translate = await this.getTranslation("client", "spanish", word);
            let fr_translate = await this.getTranslation("client", "french", word);
            let definition = await this.getDefinition("client", "french", word);
            this.spanish[word] = sp_translate;
            this.french[word] = fr_translate;
            this.definition[word] = definition;
        }
        // console.log("All words: ", allWords);
        console.log("Spanish Dictionary: ", this.spanish);
        console.log("French Dictionary: ", this.french);
        console.log("Definitions: ", this.definition);
    }

    /**
     * Validates a user by sending a GET request with custom headers for username and password.
     *
     * @param {string} username - The username to validate.
     * @param {string} password - The password associated with the username.
     * @returns {Promise<number>} - A promise that resolves to:
     *                               0 if successful,
     *                               1 if username not exist,
     *                               2 if password is incorrect
     *                              -1 for malformed input or any other error.
     */
    async validateUser(username, password) {
        if (username.length === 0 || password.length === 0) {
            return -1;
        }

        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Password': password
            }
        };
        const response = await this.retrieveData(this.userTable, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200:
                return 0;
            case 404:
                return 1;
            case 403:
                return 2;
            default:
                return -1;
        }
    }

    /**
     * Create a user by sending a POST request with custom headers for username and password.
     *
     * @param {string} username - The username to create.
     * @param {string} password - The password associated with the username.
     * @returns {Promise<number>} - A promise that resolves to:
     *                               0 if the registration successful,
     *                               1 if username already exist,
     *                               2 if username or password is invalid(malformed),
     *                              -1 for any other error or unknown status code.
     */
    async addNewUser(username, password) {
        if (username.length === 0 || password.length === 0) {
            return 2;
        }
        const options = {
            method: 'POST',
            headers: {
                'Username': username,
                'Password': password
            }
        };
        const response = await this.retrieveData(this.userTable, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200: return 0; // 200 OK
            case 409: return 1; // 409 Conflict
            case 406: return 2; // 406 Not Acceptable
            default: return -1;
        }
    }

    /**
     * Retrieves a user's dictionary data by sending a GET request.
     * This method is used to fetch language-specific data for a given user, which
     * include records like a list of learned words.
     *
     * @param {string} username - The username to identify the user whose data is being requested.
     * @param {string} language - The user's current language context (e.g., french, spanish).
     *
     * @returns {Promise<Object|null>} - A JSON object or null if the data cannot be retrieved,
     *                                   which could occur due to invalid credentials, or internal server issues.
     *                                   The function returns an object directly related to the language learning context,
     *                                   such as a list of words, or a structured object containing language learning progress.

     * Possible Resolutions:
     * - { apple: 5, banana: 3, pear: 1 } // Sample data format if successful.
     * - null // If there is an error or data cannot be found.
     */
    async getUserDictionary(username, language) {
        if (username in this.userData && this.userData[username] != null) {
            console.log("User Dictionary found locally")
            return this.userData[username];
        }

        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Asset': 'learned'
            }
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status === 200) {
            let result = await response.json();
            this.userData[username] = result;
            return result; // Assuming JSON response
        } else {
            return null; // Error or data not found
        }
    }

    /**
     * Notify the server that a user has learned a new word.
     * Use the proficiency parameter to change user's existing record
     *
     * @param {string} username - The username to identify the user whose data is being requested.
     * @param {string} language - The user's current language context (e.g., french, spanish).
     * @param {string} word -     The specific word to learn
     * @param {number} [proficiency=5] - The number represent user's proficiency (1 - 10)
     * @returns {Promise<number>} - A promise that resolves to:
     *                               0 if the update is successful,
     *                               1 if word not exist in database,
     *                              -1 for any other error or unknown status code.
     */
    async updateUserDictionary(username, language, word, proficiency = 5) {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Username': username,
                'Game-Language': language
            },
            body: JSON.stringify({ [word]: proficiency })
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200: case 201: return 0; // 200 OK, 201 Created
            case 404: return 1; // 404 Not Found
            default: return -1;
        }
    }

    async clearCache(username) {
        if (username in this.userData) {
            this.userData[username] = null;
        }
        this.init();
    }
    /**
     * 
     * @param {*} username 
     * @param {*} language 
     * @param {*} word 
     * @returns {Promise<number>} - A promise that resolves to:
     *                               0 if the update is successful,
     *                               1 if word not exist in database,
     *                              -1 for any other error or unknown status code.
     */
    async learnNewWord(username, language, word) {
        this.userData[username] = null;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Username': username,
                'Game-Language': language,
                'Action': 'learn'
            },
            body: word
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200: case 201: return 0; // 200 OK, 201 Created
            case 404: return 1; // 404 Not Found
            default: return -1;
        }
    }

    async downProficiency(username, language, word) {
        //this.userData[username] = null;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Username': username,
                'Game-Language': language,
                'Action': 'proficiency down'
            },
            body: word
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200: case 201: return 0; // 200 OK, 201 Created
            case 404: return 1; // 404 Not Found
            default: return -1;
        }
    }

    async upProficiency(username, language, word) {
        //this.userData[username] = null;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Username': username,
                'Game-Language': language,
                'Action': 'proficiency up'
            },
            body: word
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        switch (response.status) {
            case 200: case 201: return 0; // 200 OK, 201 Created
            case 404: return 1; // 404 Not Found
            default: return -1;
        }
    }

    /**
     * Get all available words in database within a certain category
     * @param {*} username 
     * @param {*} language 
     * @param {*} word 
     * @returns {Promise<number>} - A promise that resolves to:
     *                               0 if the update is successful,
     *                               1 if word not exist in database,
     *                              -1 for any other error or unknown status code.
     */
    async getAllWordsByCategory(username, category) {

        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Target-Asset': category
            }
        };
        const response = await this.retrieveData(this.allDict, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status === 200) {
            return await response.json();
        } else {
            return null; // Error or data not found
        }
    }

    async getProgressPercentage(username, language) {

        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Asset': 'percentage'
            }
        };
        const response = await this.retrieveData(this.userProgress, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status === 200) {
            return await response.json();
        } else {
            return null; // Error or data not found
        }
    }

    /**
     * Retrieves the translation of a word in the specified language.
     * 
     * This function first checks local dictionaries for the translation. If the translation
     * is not found locally or if the local value is empty, it fetches the translation from 
     * a remote data source.
     * 
     * @param {string} username - The username of the user requesting the translation.
     * @param {string} language - The language into which the word should be translated.
     *                             Supported languages are "spanish" and "french".
     * @param {string} word - The word that needs to be translated.
     * 
     * @returns {Promise<string|null>} A promise that resolves to the translated word as a string,
     *                                  or null if the translation cannot be found or an error occurs.
     */
    async getTranslation(username, language, word) {
        if (language == "spanish") {
            if (word in this.spanish && this.spanish[word] !== null && this.spanish[word] !== undefined && this.spanish[word] !== '') {
                // console.log("Spanish translation found locally");
                return this.spanish[word];
            }
        }
        else if (language == "french") {
            if (word in this.french && this.french[word] !== null && this.french[word] !== undefined && this.french[word] !== '') {
                // console.log("French translation found locally");
                return this.french[word];
            }
        }

        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Word': word
            },
        };
        const response = await this.retrieveData(this.allDict, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status === 200) {
            let result = await response.json();
            return String(result[word]).trim();
        } else {
            return null; // Error or data not found
        }
    }
    /**
     * Fetches the definition of a specified word in the given language from a remote service.
     * This function constructs a request to the remote data source with necessary headers
     * and fetches the definition using an HTTP GET request.
     *
     * @param {string} username - The username of the user requesting the definition. This is used
     *                            for authentication or user-specific customization if necessary.
     * @param {string} language - The language context of the word. This parameter helps the server
     *                            determine in which language the definition should be provided.
     * @param {string} word - The word for which the definition is being requested.
     *
     * @returns {Promise<string|null>} A promise that resolves to the definition of the word as a string,
     *                                 or null if the definition cannot be found or an error occurs during the fetch.
     */
    async getDefinition(username, language, word) {
        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Word': word,
                'Action': 'definition'
            },
        };
        const response = await this.retrieveData(this.allDict, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status === 200) {
            return response.text();
        } else {
            return null; // Error or data not found
        }
    }
    /**
     * Generates a quiz question word based on the user's learned words and the specified difficulty.
     * 
     * @param username - The username to identify the user.
     * @param language - The language context of the user.
     * @param difficulty - The difficulty level for selecting the word (0-3).
     *  - 0: Weighted difficulty not applied (all weights are 1).
     *  - 1-3: The higher the number, the more the weights impact the selection.
     * 
     * @returns {Promise<string | null>} A promise that resolves to the selected word based on the given difficulty, or null if there is an error.
     */
    async getQuestionWord(username, language, difficulty) {
        const learned_words = await this.getUserDictionary(username, language);
        if (this.#DEBUG) {
            console.log('The user has learned: \n', learned_words, "\n\n");
        }

        const keys = Object.keys(learned_words);
        const weights = Object.values(learned_words);

        let adjustedWeights;
        if (difficulty === 0) {
            // If difficulty is 0, treat all weights equally as 1
            adjustedWeights = weights.map(() => 1);
        } else {
            // Adjust weights based on the difficulty
            adjustedWeights = weights.map(weight => Math.pow(weight, difficulty));
        }

        const cumulativeWeights = [];
        let totalWeight = 0;

        for (let weight of adjustedWeights) {
            totalWeight += weight;
            cumulativeWeights.push(totalWeight);
        }

        // Generate a random number between 0 and the total weight
        const randomNum = Math.random() * totalWeight;

        // Find the corresponding item using linear search
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (randomNum < cumulativeWeights[i]) {
                return keys[i];
            }
        }

        return null; // Should not occur unless there's an error in the data
    }
    /**
     * Generates a multiple-choice question for a given word based on the user's learned words and language context.
     *
     * @param username - The username to identify the user.
     * @param language - The language context of the user.
     * @param word - The word for which to generate multiple-choice options.
     * @returns A promise that resolves to a JSON string containing the correct answer index and an array of choices, or null if there is an error.
     */
    async getMultipleChoice(username, language, word) {
        const translate_word = await this.getTranslation(username, language, word);
        console.log("Picked word: ", translate_word);
        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Word': word,
                'Action': "fake"
            },
        };
        const response = await this.retrieveData(this.ai, options);
        if (this.#DEBUG)
            this.printDebug(response);
        if (response.status !== 200) {
            return null; // Error or data not found
        }
        const text_response = await response.text();

        let choices = text_response.trim().split(/\s*\r?\n\s*/).map(word =>
            word.replace(/[\d\s.]/g, '')
        );
        let answer;
        const index = choices.indexOf(translate_word);
        if (index === -1) {
            choices.pop();
            answer = Math.floor(Math.random() * 4);
            choices.splice(answer, 0, translate_word);
        } else {
            answer = index;
        }

        let ret = [answer, choices];
        return ret;
    }

    async getConversation(username, language, category, word) {
        const options = {
            method: 'GET',
            headers: {
                'Username': username,
                'Game-Language': language,
                'Target-Word': word,
                'Target-Asset': category,
                'Action': "conversation"
            },
        };
        const response = await this.retrieveData(this.ai, options);
        if (response.status === 200) {
            let result = await response.json();
            return String(result[word]).trim();
        } else {
            return null; // Error or data not found
        }
    }

    // private function
    async retrieveData(target, options) {
        // Create a promise that rejects in 5000 milliseconds (5 seconds)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out')); // Reject with an error when timeout is reached
            }, 6000); // Timeout set to 6 seconds
        });

        try {
            const response = await Promise.race([
                fetch(`${this.baseURL}${target}`, options), // The actual fetch request
                timeoutPromise                               // The timeout promise
            ]);
            return response

        } catch (error) {
            console.error('Error during the fetch operation:', error);
            return -1; // Error condition
        }
    }

    printDebug(response) {
        // Log the response status line for debugging
        console.log(`Response status line: HTTP/${response.status} ${response.statusText}`);

        // Log all response headers
        console.log('Response headers:');
        response.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        console.log(response)
    }

}

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GameClient;
} else {
    // Export for Browser (attach to window object)
    if (typeof window !== 'undefined') {
        window.GameClient = GameClient;
    }
}

// ES Module export (supports `import` syntax)
// export default GameClient;