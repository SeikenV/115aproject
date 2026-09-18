import './LoginPage.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';

/**
 * LoginPage Component.
 * 
 * The login page for the Vocab Venture application.
 * Allows users to enter their username and password to log in.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const LoginPage = function() {

    // State for login status
    const [loginStatus, setLoginStatus] = useState(null);
    // State for error message
    const [errorMsg, setErrorMsg] = useState('');

    
    const navigate = useNavigate();

    // Navigate back to home page
    const goToMainPage =() => {navigate('/home')};
    // Navigate to selecting language page
    const goToLanguage = () => {
        const username = document.getElementById('username').value;
        navigate('/language', { state: { username } });
    };

    
    /*
    * The useEffect checks if the username and password are valid by calling handleLogin().
    * It gives an error message if the username and password are not valid.
    */
    useEffect(() => {
        const submitLoginElement = document.getElementById('submit-login-id');
        if (submitLoginElement) {
            submitLoginElement.addEventListener('click', () => {
                handleLogin().then((result) => {
                    // Handle the result of the login attempt
                    if (result.status === 'success') {
                        goToLanguage();
                    } else {
                        setLoginStatus('failed');
                        setErrorMsg(result.message);
                    }
                }).catch((error) => {
                    setErrorMsg('An error occurred during login. Please try again.');
                });
            });
            return () => {
                submitLoginElement.removeEventListener('click', handleLogin);
            };
        }
    }, []);

    return(  
            <div className='wrapper'>

                <form action ="">
                    <h1>Login</h1>
                    <label>Username</label>
                    
                    <div className= "input-box">
                        <input type="text" id = "username" placeholder='Username' required autoComplete="username" />
                    </div>

                    <label>Password</label>

                    <div className="input-box">
                        <input type="password" id="password" placeholder='Password' required autoComplete="current-password" />
                    </div>

                    {errorMsg && <p className="error-msg">{errorMsg}</p>}<br></br>
                
                    <button type= "button" id= "submit-login-id">Login</button>

                    <p>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                    <hr/>
                    <button type= "button" id = "submit-mainpage" onClick= {goToMainPage}>Back Home</button>
                    
                </form>
                
                </div>
 
     );
};

export default LoginPage;
