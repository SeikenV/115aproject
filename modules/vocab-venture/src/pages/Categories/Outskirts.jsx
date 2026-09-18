

// import '../../components/combatPopups/MultChoice.css';

// import cat from '../../assets/outskirts-assets/testSS.png';
// import catHIT from '../../assets/outskirts-assets/catHitSS.png';
// import catATTACK from '../../assets/outskirts-assets/catAttackSS.png';
// import slime from '../../assets/outskirts-assets/slimeIDLE.png'
// import slimeHIT from '../../assets/outskirts-assets/slimeHIT.png'
// import slimeATTACK from '../../assets/outskirts-assets/slimeATTACK.png'

// import correctEffect1 from '../../assets/outskirts-assets/correctEffect1.png'
// import correctEffect2 from '../../assets/outskirts-assets/correctEffect2.png'
// import incorrectEffect1 from '../../assets/outskirts-assets/incorrectEffect1.png'
// import correctEffect3 from '../../assets/outskirts-assets/correctEffect3.png'




// import '../../components/combatPopups/Quiz.css';
// import TypePopup from '../../components/combatPopups/Type';
// import MCPopup from '../../components/combatPopups/MultChoice';
// import MatchPopup from '../../components/combatPopups/Match';


// // import { useLocation } from 'react-router-dom';
// import { useNavigate, useLocation } from 'react-router-dom';

// import React, { useState, useEffect } from 'react';


// const Outskirts = () => {
//     //const [timer, setTimer] = useState(10000000); // Initial timer value in seconds
//     const [typePopup, setTypePopup] = useState(false);
//     const [mcPopup, setMcPopup] = useState(false);
//     const [matchPopup, setMatchPopup] = useState(false);
//     const [isHit, setIsHit] = useState(false);
//     const [isAttacking, setIsAttacking] = useState(false);
//     const [isSlimeHit, setIsSlimeHit] = useState(false);
//     const [isSlimeAttacking, setIsSlimeAttacking] = useState(false);
//     const [userDictionary, setUserDictionary] = useState([]);
//     const [wordToShow, setWordToShow] = useState('');
//     const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); 
//     const [isStartClicked, setIsStartClicked] = useState(false);
//     const [isQuestionDone, setIsQuestionDone] = useState(false); //if the time runs out or answers correctly/incorrectly this will be true
//     const [currentDictIndex, setCurrentDictIndex] = useState(0);
//     const [shuffledDictKeys, setShuffledDictKeys] = useState([]);
//     const [qType, setQType] = useState(0); //0 is mult choice, 1 type, 2 match
//     const [wordGroup, setWordGroup] = useState([]); //store 4 words to pass to mult choice and matching
//     const [correctMessage, setCorrectMessage] = useState("");

//     const [backgroundStall, setBackgroundStall] = useState(false);

//     const [correctCounter, setCorrectCounter] = useState(0);
//     const [wrongCounter, setWrongCounter] = useState(0);


//     const [beforeCorrectCounter, setBeforeCorrectCounter] = useState(0);
//     const [beforeWrongCounter, setBeforeWrongCounter] = useState(0);



//     const navigate = useNavigate(); 
//     const location = useLocation();
//     const username = location.state.username;
//     const selectedlanguage = location.state.language;

//     console.log("COUNTING", correctCounter, wrongCounter);
    
//     useEffect(() => {


//         setBeforeCorrectCounter(correctCounter);
//         setBeforeWrongCounter(wrongCounter);
//         console.log("BEFORE COUNTING", beforeCorrectCounter, beforeWrongCounter);


//     })

//     const goToAfterPage = () => {
//         console.log("quizzzzzzzzzz", beforeCorrectCounter, beforeWrongCounter);
//         navigate('/afterquizpage', { state: { username, selectedlanguage, beforeCorrectCounter, beforeWrongCounter } });

//     };

    

//     const goToMap = () => {
//         navigate('/map', { state: { username, language: selectedlanguage } });
//     };

//     const getTheUserInformation = async (username, language) => {
//         try {
//             const result = await gameClient.getUserDictionary(username, language);
//             return result;
//         } catch (error) {
//             return { status: 'error', message: 'An error occurred during login. Please try again.' };
//         }
//       }

//       //run every time the user finished a question
//       useEffect(() => {
//         if(isAnswerCorrect == false && isQuestionDone ==true){
//             console.log("wrong answer");
//             getNextQuestion();
//             setCorrectMessage("Incorrect!");
//             setTimeout(()=>{
//                 setCorrectMessage("");
//             },1000);

//         }
//         else if(isAnswerCorrect == true && isQuestionDone == true){
//             console.log("correct answer");
//             getNextQuestion();
//             setCorrectMessage("Correct!");
//             setTimeout(()=>{
//                 setCorrectMessage("");
//             },1000);


//         }
    
//       }, [isQuestionDone])

//       useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 console.log(username, selectedlanguage);
//                 const result = await getTheUserInformation(username, selectedlanguage);
//                 if (!result) {
//                     console.error('User dictionary is empty or undefined.');
//                     return;
//                 }

//                 console.log("result", result);


//                 // Shuffle the entries (key-value pairs) in the dictionary
//                 const shuffledEntries = Object.entries(result).sort(() => Math.random() - 0.5);
//                 const shuffledDictionary = Object.fromEntries(shuffledEntries);

//                 console.log("shuffledDictionary", shuffledDictionary);
//                 setUserDictionary(shuffledDictionary); //set user dictionary (includes proficiencies)
                
//             } catch (error) {
//                 console.error('An error occurred while fetching user information:', error);
//             }
//         };
//         fetchData();
//     }, [username, selectedlanguage]);
    
  
//     //load the dictionary into the shuffledDictKeys variable
//     useEffect(() => {
//         setShuffledDictKeys(Object.keys(userDictionary));
//     },[userDictionary]);

//     useEffect(() => {
//         if(isStartClicked == true && isQuestionDone == false){
//             if(qType == 0){
//                 console.log("Word group passed to MC ", wordGroup);
//                 setMcPopup(true);
//                 setTypePopup(false);
//                 setMatchPopup(false);
//             }
//             else if(qType == 1){
//                 console.log("Word being passed to Type: ", wordToShow);
//                 setTypePopup(true);
//                 setMcPopup(false);
//                 setMatchPopup(false);
//             }
//             else if(qType == 2){
//                 console.log("Word Group being passed to Match: ", wordGroup);
//                 setMatchPopup(true);
//                 setMcPopup(false);
//                 setTypePopup(false);
//             }
//         }
//     },[qType, isStartClicked]);


//     const handleStartClick = () =>{
//         setIsStartClicked(true);
//         getNextQuestion();
//     }
       
//     const sendWords = (numWords) =>{
//         //console.log("shuffled keys",shuffledDictKeys);

//             console.log("current dictionary index: ", currentDictIndex);
//             setWordToShow(shuffledDictKeys[currentDictIndex]);
//             //console.log(shuffledDictKeys);

//             let next4Words = shuffledDictKeys.slice(currentDictIndex, currentDictIndex + 4)
//             console.log("INIT ", next4Words);
//             let wordGroupLen = next4Words.length;
//             console.log("WG LEN ",wordGroupLen);
//             if (wordGroupLen < 4){
//                 next4Words = next4Words.concat(shuffledDictKeys.slice(0, 4-wordGroupLen));
//             }
//             console.log("AFTER ", next4Words);
//             setWordGroup(next4Words);
//             setCurrentDictIndex((currentDictIndex + numWords) % shuffledDictKeys.length);


//     }
    
//     const playCorrectEffect= ()=>{

//             if(qType == 0){
//                 return( 
//                     <div className= "coverUpBG">
//                         <div className="Effects" >
//                             <img className= "correctEffect1SS" src= {correctEffect1} ></img>
//                         </div>
//                     </div>
//                 )
//             }
//             else if (qType == 1){
//                 return( 
//                     <div className= "coverUpBG">
//                         <div className="Effects" >
//                             <img className= "correctEffect2SS" src= {correctEffect2} ></img>
//                         </div>
//                     </div>
//                 )

//             }
//             else{
//                 return( 
//                     <div className= "coverUpBG">
//                         <div className="Effects" >
//                             <img className= "correctEffect3SS" src= {correctEffect3} ></img>
//                         </div>
//                     </div>
//                 )

//             }
        
//     }
//     const playIncorrectEffect= ()=>{
//         return( 
//         <div className= "coverUpBG">
//             <div className="Effects" >
//                 <img className="incorrectEffect1SS" src= {incorrectEffect1} ></img>
//             </div>
//         </div>)
//     }

//     const playSlimeIdleAnim = () =>{
//         return( <img className= "slimeSS" src= {slime} ></img>)
//     }
//     const playSlimeAttackAnim = () =>{

        
        
//         return(
//             <img onAnimationEnd= {handleSlimeEndAttackAnimation} className = "slimeAttackSS" src={slimeATTACK}></img>
//         )

//     }
//     const playSlimeHitAnim = () =>{
//             return(
//                 <img onAnimationEnd= {handleSlimeEndHitAnimation} className = "slimeHitSS" src={slimeHIT}></img>
//          )

        
//     }


   
//     const playAttackAnim = () =>{
//         console.log("ONCEEEEE");
//         handleStall();
//         return(
//             <img onAnimationEnd= {handleEndAttackAnimation} className = "catAttackSS" src={catATTACK}></img>
//         )
//     }
//     const playHitAnim = () =>{
//             return(
//                 <img onAnimationEnd= {handleEndHitAnimation} className = "catHitSS" src={catHIT}></img>
//             )
        
//     }
//     const handleSlimeEndHitAnimation = () =>{
//         setIsSlimeHit(false);
//     }
//     const handleSlimeEndAttackAnimation = () =>{
//         setIsSlimeAttacking(false);
//     }
//     const handleEndAttackAnimation = () =>{
//         setIsAttacking(false);
       
//     }
//     const handleEndHitAnimation = () =>{
//         setIsHit(false);
//     }

//     const handleStall = () => {
//             setTimeout(() => {
//                 setBackgroundStall(false);
//             },2800)

//     }

//     const playIdleAnim = () => {
//         return( <img className= "catSS" src= {cat} ></img>)
//     }

    
//     const getNextQuestion = () => {
//         let q = Math.floor(Math.random() * 3)
//         setQType(q);
//         setBackgroundStall(true);
//         handleStall();
//         setIsQuestionDone(false);
        
        
//         console.log("Question: ", q);
//         sendWords(1); //num words to send, */
//     }

//     const [timer, setTimer] = useState(60); // Initial timer value in seconds
   
  

//     useEffect(() => {
//         if (isStartClicked) {
//             const interval = setInterval(() => {
//                 setTimer(prevTimer => {
//                     if (prevTimer <= 1) {
//                         clearInterval(interval);
//                         setIsQuestionDone(true);

                
//                         return 0;
//                     }
//                     return prevTimer - 1;
//                 });
//             }, 1000);
//             return () => clearInterval(interval);
//         }
//     }, [isStartClicked]);

//     console.log("TIMERRRRRR", timer);


//     useEffect(() => {
//         if (timer == 0) {
//             setBeforeCorrectCounter(correctCounter);
//             setBeforeWrongCounter(wrongCounter);
//             console.log("TIMR COUNTING", beforeCorrectCounter, beforeWrongCounter);
//             goToAfterPage();

//         }
//     });


//     // const handleAnswer = (isCorrect) => {
//     //     if (isCorrect) {
//     //         setCorrectCounter(prev => prev + 1);
//     //     } else {
//     //         setWrongCounter(prev => prev + 1);
//     //     }
//     // };
    
    
//     return(  
//         <div className = "combatBackground">
//             {correctMessage && (
//                 <div className="isCorrect-display">
//                     <p>{correctMessage}</p>
//                 </div>
//             )}
            
//             {backgroundStall ? 
//             <div className= "coverUpBG"></div>:
//             ""
//             }
//             <div className='timer'>
                
//                 <h1>Timer: {timer === 0 ? "Time is up!" : timer}</h1>


//             </div>

            
//             <div className = "Sprite"> {isAttacking ? playAttackAnim():
//                 (isHit ? playHitAnim() : playIdleAnim()
//             )
                
//                 } 
//             </div>

//             <div className = "SpriteOpp"> {isSlimeAttacking ? playSlimeAttackAnim():
//             (isSlimeHit ? playSlimeHitAnim():  playSlimeIdleAnim())
//                 } 
//             </div>
//             {isAttacking ? playCorrectEffect():
//             (isSlimeAttacking ? playIncorrectEffect() : "")
//             } 


//             {isStartClicked ? 
//             <div></div>
//             :
//             <div className = "start-btn">
//                 <button type="button" onClick= {() => handleStartClick()}> 
//                         START            
//                 </button>
//             </div>}
            
//             <TypePopup trigger = {typePopup} setTrigger={setTypePopup} username={username} selectedLanguage={selectedlanguage}
//             setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} wordToShow = {wordToShow} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone}
//             setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
//             </TypePopup>
//             <MCPopup trigger = {mcPopup} setTrigger= {setMcPopup}username={username} selectedLanguage={selectedlanguage}
//             setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} wordToShow = {wordToShow} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone} wordGroup = {wordGroup}
//             setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
//             </MCPopup>
//             <MatchPopup trigger = {matchPopup} setTrigger= {setMatchPopup}username={username} selectedLanguage={selectedlanguage}
//             setIsHit = {setIsHit} setIsAttacking = {setIsAttacking} setIsSlimeAttacking = {setIsSlimeAttacking} setIsAnswerCorrect = {setIsAnswerCorrect} setIsQuestionDone = {setIsQuestionDone} wordGroup = {wordGroup}
//             setIsSlimeHit = {setIsSlimeHit} correctCounter = {correctCounter} setCorrectCounter = {setCorrectCounter} wrongCounter = {wrongCounter} setWrongCounter = {setWrongCounter} >
//             </MatchPopup>
//             <button type="button" id="goToMapButton" onClick={goToMap}> Go to Map</button>

//         </div>
    
                
     
    
//      );
// };

// export default Outskirts;




import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MultChoice from '../../components/combatPopups/MultChoice';
import Type from '../../components/combatPopups/Type';
import './Outskirts.css';


const Outskirts = function() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;
    const selectedlanguage = location.state.language;

    const [questionType, setQuestionType] = useState('MultChoice'); // Default to 'MultChoice'
    const [difficulty, setDifficulty] = useState('easy'); // Default difficulty level
    //allows the user to go to the type mode
    const goToType = () => {
        navigate('/typeOG', { state: { username, language: selectedlanguage, questionType, difficulty } });
    };
    //allows the user to go to the multiple choice mode
    const multipleChoice = () => {
        navigate('/multiplechoiceOG', { state: { username, language: selectedlanguage, questionType, difficulty } });
    };
    //allows the user to go to the match mode
    const match = () => {
        navigate('/match', { state: { username, language: selectedlanguage, questionType, difficulty } });
    };
    //allows the user to go to the quiz mode
    const quiz = () => {
        navigate('/quiz', { state: { username, language: selectedlanguage, questionType } });
    };

    return(  
        <div className="combatbackground">
            <h1>Outskirts</h1>
            <p>select a game-mode below to play</p>
            <div className= "outskirts-buttons">
                <button type="button" id="goToType" onClick={goToType}>
                    Type
                </button>
                <button type="button" id="goToMultChoice" onClick={multipleChoice}>
                    Multiple Choice
                </button>
                <button type="button" id="goToQuiz" onClick={quiz}>
                    All Modes
                </button>
            </div>
        </div>
    );
};

export default Outskirts;