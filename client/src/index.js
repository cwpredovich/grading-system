import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import "bootstrap/dist/css/bootstrap.min.css";
// import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App2 from './AppReimagined';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="596139829850-7lp5j3f45k0f4os5hu5jnqaolgbr5ja9.apps.googleusercontent.com">
    <React.StrictMode>
      {/* <App /> */}
      <App2 />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
