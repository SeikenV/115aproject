// import React from 'react';
// import React, { useEffect } from 'react';
import React, { useEffect, useState } from 'react';

import './Dictionary.css'; // Import your CSS file for styling
import closeimg from '../../assets/dictionary-assets/CloseTab.png'
import menuimg from '../../assets/dictionary-assets/MenuTab.png'
import nextimg from '../../assets/dictionary-assets/PageFWD.png'
import prvsimg from '../../assets/dictionary-assets/PageBKWD.png'
import pagesimg from '../../assets/dictionary-assets/Pagesfull.png'
import baseimg from '../../assets/dictionary-assets/DictionaryBaseFull.png'
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// important all of the assets to display along with each word
import blue from '../../assets/dict-images/colors/blue.png';
import black from '../../assets/dict-images/colors/black.png';
import brown from '../../assets/dict-images/colors/brown.png';
import green from '../../assets/dict-images/colors/green.png';
import orange from '../../assets/dict-images/colors/orange.png';
import red from '../../assets/dict-images/colors/red.png';
import white from '../../assets/dict-images/colors/white.png';
import yellow from '../../assets/dict-images/colors/yellow.png';

import apple from '../../assets/dict-images/food/Apple.png';
import bread from '../../assets/dict-images/food/Bread.png';
import egg from '../../assets/dict-images/food/Eggs.png';
import fish from '../../assets/dict-images/food/Fish.png';
import juice from '../../assets/dict-images/food/Juice.png';
import meat from '../../assets/dict-images/food/Meat.png';
import milk from '../../assets/dict-images/food/Milk.png';
import water from '../../assets/dict-images/food/Water.png';

import shirt from '../../assets/dict-images/clothing/shirt.png';
import hat from '../../assets/dict-images/clothing/hat.png';
import skirt from '../../assets/dict-images/clothing/skirt.png';
import jacket from '../../assets/dict-images/clothing/jacket.png';
import socks from '../../assets/dict-images/clothing/socks.png';
import shoes from '../../assets/dict-images/clothing/shoes.png';
import gloves from '../../assets/dict-images/clothing/gloves.png';
import pants from '../../assets/dict-images/clothing/pants.png';

import desk from '../../assets/dict-images/school/desk.png'
import paper from '../../assets/dict-images/school/paper.png'
import pencil from '../../assets/dict-images/school/pencil.png'
import pen from '../../assets/dict-images/school/pen.png'
import student from '../../assets/dict-images/school/student.png'
import teacher from '../../assets/dict-images/school/teacher.png'
import classroom from '../../assets/dict-images/school/classroom.png'
import book from '../../assets/dict-images/school/book.png'

const getWordImageSrc = (wordImage) => {
  switch (wordImage) {
      case 'black':
          return black;
      case 'blue':
          return blue;
      case 'brown':
          return brown;
      case 'red':
          return red;
      case 'yellow':
          return yellow;
      case 'green':
          return green;
      case 'white':
          return white;
      case 'orange':
          return orange;
      case 'apple':
        return apple;
      case 'bread':
          return bread;
      case 'egg':
          return egg;
      case 'fish':
          return fish;
      case 'juice':
          return juice;
      case 'meat':
          return meat;
      case 'milk':
          return milk;
      case 'water':
          return water;
      case 'shirt':
          return shirt;
      case 'hat':
          return hat;
      case 'skirt':
          return skirt;
      case 'jacket':
          return jacket;
      case 'socks':
          return socks;
      case 'shoes':
          return shoes;
      case 'gloves':
          return gloves;
      case 'pants':
          return pants;
      case 'desk':
          return desk;
      case 'paper':
          return paper;
      case 'pencil':
          return pencil;
      case 'pen':
          return pen;
      case 'student':
          return student;
      case 'teacher':
          return teacher;
      case 'classroom':
          return classroom;
      case 'book':
          return book;
      default:
          return null;
  }
};

const getTheUserInformation = async (username, language) => {  
  try {
      const result = await gameClient.getUserDictionary(username, language);
      // return { status: 'success' };
      return result;
      // return { status: 'success', result: result };
  } catch (error) {
      return { status: 'error', message: 'An error occurred during login. Please try again.' };
  }
}

function DictionaryPopup (props) { // the pop up will fetch two of the learned translations to display

  const { selectedLanguage } = props;


  const navigate = useNavigate(); 
  const goToMenu =() => {navigate('/home')};
  const [userDictionary, setUserDictionary] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [translations, setTranslations] = useState({});
  const [translatedWord, setTranslatedWord] = useState('');


  const [translatedWord2, setTranslatedWord2] = useState('');


const handleClose = () => {
  props.setTrigger(false);
  setCurrentPage(0); // Reset the current page to 0
};


const handleNextPage = () => { // This is the handler to access the other pages in the user's dictionary
  if (currentPage < Math.floor((Object.keys(userDictionary).length - 1) / 2)) {
    setCurrentPage(current => {
      const nextPage = current + 1;
      console.log("Current Page:", nextPage); // Log the updated current page
      return nextPage;
    });
  } else {
    console.log("Cannot go to next page. Limit reached.");
  }
};
 

  const handlePreviousPage = () => { // This is the handler to access the previous pages in the user's dictionary
    setCurrentPage(current => Math.max(current - 1, 0));
  };

  useEffect(() => {
    const fetchData = async () => {
        // calling the function to recieve the progress of the user
        const result = await getTheUserInformation(props.username, selectedLanguage);
        setUserDictionary(result);
        setCurrentPage(0); 
    }
    fetchData();
}, [props.username, selectedLanguage]);



const [definition, setDefinition] = useState(null); // two constants that will set the definitions to be displayed for the words
const [definition2, setDefinition2] = useState(null);


useEffect(() => {
  const fetchTranslations = async () => {
    if (userDictionary) {
      const keys = Object.keys(userDictionary);
      const key1 = keys[currentPage * 2];
      const key2 = keys[currentPage * 2 + 1];
      
      if (key1) { // this format will display the translation and definition for each of the learned words 
        const translation1 = await gameClient.getTranslation(props.username, selectedLanguage, key1);
        setTranslatedWord(translation1);

        const def = await gameClient.getDefinition(props.username, selectedLanguage, key1);
        setDefinition(def);
      }
      if (key2) { // repeat for second page on right
        const translation2 = await gameClient.getTranslation(props.username, selectedLanguage, key2);
        setTranslatedWord2(translation2);

        const def = await gameClient.getDefinition(props.username, selectedLanguage, key2);
        setDefinition2(def);
      }
    }
    
  };
  fetchTranslations();
}, [currentPage, userDictionary, props.username, selectedLanguage]);


  // display formatting for the actual page 
  return (props.trigger) ? (
    <div className= "popup">      
        <div className= "popup-inner"> 
          <div className= "button-row">
            <button className= "button" id= "dictionary-menu-btn" onClick={goToMenu}>
              <img src={menuimg} />
            </button>
            <button className="button" id="dictionary-close-btn" onClick={handleClose}>
              <img src={closeimg} />
            </button>
          </div>

           {/*LEFT PAGE DIV-------------------*/}
          <div className= "popup-page-left">
            
            <div className = "welcome-user">
              <p>Total Learned Words: {Object.keys(userDictionary).length}</p>
            </div>

            <br></br>
          
            <div className = "learned-words1" >
              {userDictionary &&
                    Object.entries(userDictionary).map(([key, value], index) => {
                        if (index % 2 === 0 && index === currentPage * 2) {
                        return (

                          <div key={key} className="word-container">
                              <div className="image-container">
                                {getWordImageSrc(key) && (
                                  <img
                                    id="wordImage1"
                                    src={getWordImageSrc(key)}
                                    alt={key}
                                  />
                                )}
                              </div>
                              

                              <div className="word-info">
                                <h1 >English: {key}</h1>
                                <h2 > {selectedLanguage}: {translatedWord}</h2>
              </div>
                            </div>
                        );
                      }
                      return null;
                    })}
              </div>
              
            <button className="button" id="prvs-page-btn" onClick={handlePreviousPage}>
                <img src={prvsimg} />
            </button>
            <br />
            {definition && (
            <div className="definition-container">
              <h2>Definition:</h2>
              <p>{definition}</p>
            </div>
          )}
          {/*end left page div*/}
          </div>

          {/* testing */}
          {/*RIGHT PAGE DIV-------------------*/}
          <div className= "popup-page-right">

            <div className = "learned-words2">
              {userDictionary &&
                  Object.entries(userDictionary).map(([key, value], index) => {
                    if (index === currentPage * 2 + 1) {
                      // showTranslation2(key);
                      return (
                        <div key={key} className="word-container2">
                            <div className="image-container">
                                  {getWordImageSrc(key) && (
                                    <img
                                      id="wordImage2"
                                      src={getWordImageSrc(key)}
                                      alt={key}
                                    />
                                  )}
                                </div>
                            <div className="word-info2">
                              <h1  >English: {key}</h1>
                              <h2 > {selectedLanguage}: {translatedWord2}</h2>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
            </div>
            {definition2 && (
            <div className="definition-container2">
              <h2>Definition:</h2>
              <p>{definition2}</p>
            </div>
          )}

            <button className="button" id="next-page-btn" onClick={handleNextPage} 
              disabled={currentPage >= Math.floor((Object.keys(userDictionary).length - 1) / 2)}>
              <img src={nextimg} />
            </button>
          {/*end right page div*/}
          </div>

                  
        {/*end inner div*/}
        </div>
        {/*end popup*/}
    </div>
  ) : "";
}
export default DictionaryPopup;