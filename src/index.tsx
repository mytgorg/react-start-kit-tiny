import React from 'react';
import ReactDOM from 'react-dom';
import { Navigation } from './components';
import './assets/styles/global.css';
import './assets/styles/modals.css';
import './index.css';

const Main: React.FC = () => (
    <React.StrictMode>
        <Navigation />
    </React.StrictMode>
);

ReactDOM.render(<Main />, document.getElementById('root'));