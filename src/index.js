import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="478786113259-ccafbnvebg8an1lv0a0ejl2sv79qr7a1.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
