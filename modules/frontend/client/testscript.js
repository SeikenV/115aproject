const GameClient = require('./gameClient.js');  // Adjust the path to where your GameClient class is defined
// import GameClient from './gameClient.js'; // Adjust the path as needed

async function testGetUserDictionary() {
    const username = "LanguageUserTest3";
    const language = "french";

    const client = new GameClient();
    try {
        const result = await client.getUserDictionary(username, language);
        console.log('testGetUserDictionary() result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getProgressPercentage() {
    const username = " TestApril232ndUser";
    const language = "spanish";

    const client = new GameClient();
    try {
        const result = await client.getProgressPercentage(username, language);
        console.log('test_getProgressPercentage() result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function testlearnNewWord() {
    const username = "TestApril23";
    const language = "spanish";
    const new_word = "school"
    const client = new GameClient();
    try {
        const result = await client.learnNewWord(username, language, new_word);
        console.log('testlearnNewWord()\'s result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }

}

async function testupProficiency() {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const word = "airport"
    const client = new GameClient();
    try {
        const result = await client.upProficiency(username, language, word);
        console.log('testupProficiency()\'s result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getAllWordsByCategory() {
    const category = "locations"
    const username = "TestApril232ndUser"
    const client = new GameClient();
    try {
        const result = await client.getAllWordsByCategory(username, category);
        console.log('test_getAllWordsByCategory()\'s result:\n', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getTranslation(word) {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const client = new GameClient();
    try {
        const result = await client.getTranslation(username, language, word);
        console.log('test_getTranslation()\'s result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getDefinition() {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const word = "airport"
    const client = new GameClient();
    try {
        const result = await client.getDefinition(username, language, word);
        console.log('test_getDefinition()\'s result:', result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getQuestionWord(difficulty) {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const client = new GameClient();
    try {
        const result = await client.getQuestionWord(username, language, difficulty);
        console.log(`test_getUserQuiz()\'s result: ${result}`);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getMultipleChoice() {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const client = new GameClient();
    try {
        const word = await client.getQuestionWord(username, language, difficulty = 0);
        const result = await client.getMultipleChoice(username, language, word);
        console.log(`test_getFourChoices()\'s result: ${result[1]}`);
        console.log(`The correct answer is ${result[1][result[0]]}`);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_getConversation() {
    const category = "animals"
    const username = "TestApril232ndUser"
    const language = 'spanish'
    const word = 'cat'
    const client = new GameClient();
    try {
        const result = await client.getConversation(username, language, category, word);
        console.log('test_getConversation()\'s result:\n', result);
        // console.log(typeof result);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test_main() {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const client = new GameClient();
    try {
        let word = "airport"
        let result = await client.getTranslation(username, language, "airport");
        console.log('test_getTranslation()\'s result:', result);
        sleep(10000);
        for (let i = 0; i < 100; i++) {
            word = await client.getQuestionWord(username, language, 0);
            result = await client.getTranslation(username, language, word);
            console.log('test_getTranslation()\'s result:', result);
            // sleep(1000);
        }

    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function test_userser_data_cache() {
    const username = "TestApril232ndUser";
    const language = "spanish";
    const client = new GameClient();
    try {
        let word;
        let result;
        result = await client.getUserDictionary(username, language);
        console.log('getUserDictionary()\'s result:', result);
        result = await client.getUserDictionary(username, language);
        console.log('getUserDictionary()\'s result:', result);
        sleep(10000);
        for (let i = 0; i < 10; i++) {
            // result = await client.getUserDictionary(username, language);
            word = await client.getQuestionWord(username, language, 0);
            result = await client.getTranslation(username, language, word);
            console.log(`getTranslation()\'s result: (${word} : ${result})`);
            // console.log('getUserDictionary()\'s result:', result);
            // sleep(1000);
        }
        for (let i = 0; i < 10; i++) {
            word = await client.getQuestionWord(username, language, 0);
            console.log('getQuestionWord()\'s result:', word);
            result = await client.downProficiency(username, language, word);
            result = await client.getUserDictionary(username, language);
            console.log('getUserDictionary()\'s result:', result);
        }
        for (let i = 0; i < 10; i++) {
            word = await client.getQuestionWord(username, language, difficulty = 0);
            result = await client.getMultipleChoice(username, language, word);
            console.log(`getMultipleChoice()\'s result: ${result[1]}`);
            console.log(`The correct answer is ${result[1][result[0]]}`);
        }

    } catch (error) {
        console.error('Error during test:', error);
    }
}

// test_main();
test_userser_data_cache();
//testGetUserDictionary();

// testlearnNewWord();
// sleep(1000);
// testupProficiency();
// test_getAllWordsByCategory();
// sleep(10000);
// test_getTranslation("airport");

// test_getDefinition();
// sleep(10000);
// test_getProgressPercentage();

// test_getWordQuestion(2);
// console.log("High random");
// for (let i = 0; i < 20; i++){
//     test_getQuestionWord(0);
// }
// console.log("Weighted");
// for (let i = 0; i < 20; i++){
//     test_getQuestionWord(1);
// }
// console.log("More weighted");
// for (let i = 0; i < 20; i++){
//     test_getQuestionWord(2);
// }
// console.log("Focused");
// for (let i = 0; i < 20; i++){
//     test_getQuestionWord(3);
// }
// test_getMultipleChoice();
// for (let i = 0; i < 10; i++) {
//     test_getMultipleChoice();
// }

// test_getConversation();