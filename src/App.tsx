import React, { useState, useEffect } from 'react';
import './App.css';
import { ReactComponent as GithubLogo } from './icons/github-logo.svg';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

interface User {
  access_token: string
}

interface Profile {
  name: string,
  email: string,
  picture: string
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const handleLoginClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    login();
  };

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="App">
      <div className='navbar'>
        <h1>Map my Wilderness</h1>
        <div className='sign-in'>
          {!profile ? (
            <>
              <GithubLogo />
              <div className='sign-in-btn' onClick={handleLoginClick}>
                Sign in
              </div>
            </>

          ) : (
            <> <GithubLogo /><div style={{ marginLeft: "2rem" }}>{profile.name}</div></>
          )}
        </div>
      </div>
      <div className='postcard'>
        <img src={require("./images/postcard.png")} alt="Album 3" />
        <div className='postcard-letter'>
          <p>Dear Wilderness,<br /><br />You are a place of quiet wonder, where the air is fresher, the stars shine brighter, and time slows down. In your presence, I feel both small and infinite, lost yet profoundly found. Your rivers sing, your trees whisper, and your mountains stand with timeless grace. You teach patience, resilience, and the beauty of simplicity.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
