// LoginSignup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './LoginSignupPage.css';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { User } from './Models'; // Import the User class

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // If user is signed in and email is verified, redirect to dashboard
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

// Function to create a user in Firestore
const handleSignupSubmit = (e) => {
  e.preventDefault();

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Create a new User instance
      const newUser = new User(name, email, password, phoneNumber);

      // Add user data to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: newUser.name,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          batch: newUser.batch,
          testsAttempted: newUser.testsAttempted,
          dateCreated: newUser.dateCreated.toISOString(),
        });
        
        // Send email verification
        sendEmailVerification(user)
          .then(() => {
            alert('Verification email sent! Please check your inbox.');
          })
          .catch((error) => {
            console.error('Error sending verification email:', error);
          });
      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }
    })
    .catch((error) => {
      console.error('Sign-up error:', error);
    });
};

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Login with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user.emailVerified) {
          alert('Logged in successfully!');
          navigate('/dashboard'); // Redirect to dashboard on successful login
        } else {
          alert('Please verify your email before logging in.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-signup-page">
      <div className={`form-container ${isLogin ? "login-mode" : "signup-mode"}`}>
        <div className="form">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}>
            {!isLogin && (
              <>
                <div className="input-field">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label>Full Name</label>
                </div>
                <div className="input-field">
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <label>Phone Number</label>
                </div>
              </>
            )}
            <div className="input-field">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <button type="submit" className="form-btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={toggleForm}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
