import './Match.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

const Match = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

    const [currentWords, setCurrentWords] = useState([]);
    const [currentTranslations, setCurrentTranslations] = useState([]);
    const [correctMessage, setCorrectMessage] = useState("");
    const [selectedEnglishWord, setSelectedEnglishWord] = useState(null);
    const [selectedTranslation, setSelectedTranslation] = useState(null); // State to track selected translation

    const usedWords = useRef(new Set());

    useEffect(() => {
        if (props.wordGroupMatch.length > 0) {
            loadNewSet();
        }
    }, [props.wordGroupMatch]);

    const loadNewSet = () => {
        let newWords = props.wordGroupMatch;

        let newTranslations = [];
        newWords.forEach(async (word) => {
            const translation = await gameClient.getTranslation(username, selectedlanguage, word);
            newTranslations.push(translation);
            if (newTranslations.length === newWords.length) {
                setCurrentWords(shuffleArray(newWords));
                setCurrentTranslations(shuffleArray(newTranslations));
            }
        });
        newWords.forEach(word => usedWords.current.add(word));
    };

    const shuffleArray = (array) => {
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const handleWordClick = async (clickedWord, isEnglish) => {
        if (isEnglish) {
            setSelectedEnglishWord(clickedWord);
            setSelectedTranslation(null); // Reset selected translation
        } else {
            setSelectedTranslation(clickedWord);
            if (selectedEnglishWord) {
                const translation = await gameClient.getTranslation(username, selectedlanguage, selectedEnglishWord);
                console.log("HERE", translation);

                if (clickedWord === translation) {
                    console.log("correct match");
                    if (currentWords.length === 1) { // if all words matched
                        props.setTrigger(false); //hide match popup
                        props.setIsAnswerCorrect(true);
                        setTimeout(() => {
                            props.setIsAttacking(true);
                            setTimeout(() => {
                                props.setIsSlimeHit(true);
                            }, 600);
                        }, 1000);
                        console.log("All words matched");
                        props.setIsQuestionDone(true);
                    }

                    setCurrentWords(currentWords.filter(word => word !== selectedEnglishWord));
                    setCurrentTranslations(currentTranslations.filter(word => word !== clickedWord));
                    setSelectedEnglishWord(null);
                    if (currentWords.length > 1) { // only set correct message for the first 3 matches
                        setCorrectMessage("Correct!");
                    }
                    setTimeout(() => {
                        setCorrectMessage("");
                    }, 1000);
                    gameClient.downProficiency(username, selectedlanguage, selectedEnglishWord);
                    props.setCorrectCounter((prevCount) => prevCount + 1);
                } else {
                    console.log("Incorrect");
                    setCorrectMessage("Incorrect!");
                    setTimeout(() => {
                        setCorrectMessage("");
                    }, 1000);
                    gameClient.upProficiency(username, selectedlanguage, selectedEnglishWord);
                    props.setWrongCounter((prevCount) => prevCount + 1);
                }
            }
        }
    };

    const goToMap = () => {
        navigate('/map', { state: { username, language: selectedlanguage } });
    };

    return (props.trigger) ? (
        <div className="match-container">
            {correctMessage && (
                <div className="message-display-match">
                    <p>{correctMessage}</p>
                </div>
            )}
            <div className="matchCONTENT">
                <div className="word-column">
                    {currentWords.map((englishWord) => (
                        <button
                            key={englishWord}
                            className={`word-button ${selectedEnglishWord === englishWord ? 'selected' : ''}`}
                            onClick={() => handleWordClick(englishWord, true)}
                        >
                            {englishWord}
                        </button>
                    ))}
                </div>
                <div className="word-column">
                    {currentTranslations.map((translatedWord, index) => (
                        <button
                            key={`${translatedWord}-${index}`}
                            className={`word-button ${selectedTranslation === translatedWord ? 'selected-translation' : ''}`}
                            onClick={() => handleWordClick(translatedWord, false)}
                        >
                            {translatedWord}
                        </button>
                    ))}
                </div>
            </div>
            <button type="button" id="goToMapButton" onClick={goToMap}>
                Go to Map
            </button>
            <div className="instruction-box">
                <p>Click the English word, then the corresponding translated word.</p>
            </div>
        </div>
    ) : "";
};

export default Match;
