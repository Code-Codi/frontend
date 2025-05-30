import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//게시판
import StyledComponentWrapper from './StyledComponentWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StyledComponentWrapper>
      <App />
    </StyledComponentWrapper>
  </React.StrictMode>
);