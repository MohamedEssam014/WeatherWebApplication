import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './app.css';

const Root = () => {
  return (
    <React.StrictMode>
      {/* ممكن نضيف ThemeProvider هنا */}
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
