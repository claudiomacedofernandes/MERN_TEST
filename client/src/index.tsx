import './tailwind.css'; // Import tailwind.css to include Tailwind and custom styles
import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App></App>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);