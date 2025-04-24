
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigation } from './components';
import './assets/styles/global.css';
import './assets/styles/modals.css';
import './index.css';
import reportWebVitals from './reportWebVitals';

const Main: React.FC = () => (
    <React.StrictMode>
        <Navigation />
    </React.StrictMode>
);

// Use createRoot API for React 18
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
