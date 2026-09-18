import React from 'react';
import { useNavigate } from 'react-router-dom/dist';
import './MainPage.css';
import logo from '../../assets/MainPageCatLined.png';


/**
 * MainPage Component.
 * 
 * The main landing page for the Vocab Venture application.
 * Provides options to navigate to login or register pages.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const MainPage = function() {
    
    const navigate = useNavigate();

    // Navigate to the login page
    const goToLoginPage =() => {navigate('/login')};
    // Navigate to the register page
    const goToRegisterPage =() => {navigate('/register')};

    return(  
            <div className='wrapper'>
                <h1>Vocab Venture</h1>
                <p>Learn words from different languages</p>
                <img src= {logo} id= "main-page-cat" className= "center"/>
                    <div id="front-container">
                        <hr/>
                        <h3>Get Started</h3>
                            {/* Navigate to the login page */}
                            <button id="login-button" onClick= {goToLoginPage}>Login</button>
                            <p>or</p>
                            {/* Navigate to the register page */}
                            <button id="register-button" onClick= {goToRegisterPage}>Register</button>
                    </div>  
            </div>
     );
};

export default MainPage;