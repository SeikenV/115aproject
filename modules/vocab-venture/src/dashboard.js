const gameClient = new GameClient();
// import GameClient from '../client/gameClient.js';

// const gameClient = new GameClient();

document.addEventListener('DOMContentLoaded', function () {
    const frontContainer = document.getElementById('front-container');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');

    if (frontContainer) {
        document.getElementById('login-button').addEventListener('click', function () {
            console.log('Going to login page...');
            window.location.href = 'loginpage.html'; // Navigate to login page
        });
        document.getElementById('register-button').addEventListener('click', function () {
            console.log('Going to register page...');
            window.location.href = 'registerpage.html'; // Navigate to registration page
        });

    } else if (loginContainer) {
        document.getElementById('submit-login-id').addEventListener('click', handleLogin);
 
    } else if (registerContainer) {
        document.getElementById('submit-register').addEventListener('click', handleRegister);
    }
});

// function handleLogin() {
const handleLogin = async () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error-msg');
    const successMsg = document.getElementById('login-success-msg');

    // const result = await gameClient.validateUser(username, password);

    // console.log('Submitting login...');
    // console.log('Username:', username);
    // console.log('Password:', password);


    try {
        const result = await gameClient.validateUser(username, password);
        console.log('Submitting login...');
        console.log('Username:', username);
        console.log('Password:', password);

        if (result == 0) {
            console.log('Login successful');
            if (successMsg) successMsg.textContent = 'Welcome Back';
            if (errorMsg) errorMsg.textContent = '';
            return { status: 'success' };
        } else {
            console.log(result)
            console.log(result.status)
            console.log('Login failed');
            if (errorMsg) errorMsg.textContent = 'Login failed. Please check your username and password.';
            if (successMsg) successMsg.textContent = '';
            return { status: 'failed', message: 'Login failed. Please check your username and password.' };
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'An error occurred during login. Please try again.';
        return { status: 'error', message: 'An error occurred during login. Please try again.' };
    }

    // // Assuming gameClient is an instance of GameClient
    // gameClient.validateUser(username, password)
    //     .then(result => {
    //         if (result === 0) {
    //             console.log('Login successful');
    //             if (successMsg) successMsg.textContent = 'Welcome Back';
    //             if (errorMsg) errorMsg.textContent = '';
    //             return { status: 'success' };
    //             // successMsg.textContent = 'Welcome Back';
    //             // errorMsg.textContent = '';
    //             // Proceed with the game or redirect to another page
    //         } else {
    //             console.log('Login failed');
    //             if (errorMsg) errorMsg.textContent = 'Login failed. Please check your username and password.';
    //             if (successMsg) successMsg.textContent = '';
    //             return { status: 'failed', message: 'Login failed. Please check your username and password.' }; // Return a failed status
    //             // errorMsg.textContent = 'Login failed. Please check your username and password.';
    //             // successMsg.textContent = '';
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Login error:', error);
    //         errorMsg.textContent = 'An error occurred during login. Please try again.';
    //         return { status: 'error', message: 'An error occurred during login. Please try again.' }; // Return an error status

    //     });
}

// function handleRegister() {
const handleRegister = async () => {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const errorMsg = document.getElementById('register-error-msg');
    const successMsg = document.getElementById('register-success-msg');

    // console.log('Submitting register...');
    // console.log('Username:', username);
    // console.log('Password:', password);


    try {
        const result = await gameClient.addNewUser(username, password);
        console.log('Submitting register...');
        console.log('Username:', username);
        console.log('Password:', password);

        if (result === 0) {
            console.log('Register successful');
            if (successMsg) successMsg.textContent = 'Welcome to VocabVenture';
            return { status: 'success' };
            // Proceed with the game or redirect to another page
        } else if (result === -1) {
            console.log('Register failed - Username already exists');
            if (errorMsg) errorMsg.textContent = 'Username already exists. Please choose a different username.';
            return { status: 'failed', message: 'Username already exists. Please choose a different username.' };
        } else {
            console.log('Register failed');
            if (errorMsg) errorMsg.textContent = 'Register failed. Please check your username and password.';
            return { status: 'failed', message: 'Register failed. Please check your username and password.' };
        }

    } catch (error) {
        console.error('Register error:', error);
        errorMsg.textContent = 'An error occurred during login. Please try again.';
        return { status: 'error', message: 'An error occurred during login. Please try again.' };
    }


    // // Assuming gameClient is an instance of GameClient
    // gameClient.addNewUser(username, password)
    //     .then(result => {
    //         if (result === 0) {
    //             console.log('Register successful');
    //             if (successMsg) successMsg.textContent = 'Welcome to VocabVenture';
    //             // Proceed with the game or redirect to another page
    //         } else if (result === -1) {
    //             console.log('Register failed - Username already exists');
    //             if (errorMsg) errorMsg.textContent = 'Username already exists. Please choose a different username.';
    //         } else {
    //             console.log('Register failed');
    //             if (errorMsg) errorMsg.textContent = 'Register failed. Please check your username and password.';
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Register error:', error);
    //         errorMsg.textContent = 'An error occurred during register. Please try again.';
    //     });
}
