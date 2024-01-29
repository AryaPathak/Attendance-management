/* eslint-disable no-unused-vars */
// Login.js
import React, { useState } from 'react';
import './Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

 

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Make a fetch request to your backend for authentication
      const response = await fetch('http://127.0.0.1:5000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Redirect to the stopwatch page on successful login
        localStorage.setItem('userEmail', email);
        window.location.href = 'http://localhost:3000/stopwatch';
      } else {
        const data = await response.json();
        alert(data.message); // Display error message on unsuccessful login
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };




  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
            }),
        });

        const signUpConfirm = window.confirm('User has been created. Please log in to continue.');

        if (response.ok) {
          // Redirect to the stopwatch page upon successful signup
          window.location.href = 'http://localhost:3000/login';
      } else {
          const data = await response.json();
          alert(data.message);
      }
      
    } catch (error) {
        console.error('Error during registration:', error);
    }
};


  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={isLogin ? handleLogin : handleSignUp}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit" className={isLogin ? 'login-btn' : 'signup-btn'}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p onClick={toggleForm}>
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
      </p>
    </div>
  );
};


export default Login;
