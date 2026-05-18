import React from 'react';
import './styles/App.css';
import { NotificationProvider } from './hooks/useFetch';

function App() {
    return (
        <div className="App">
            <NotificationProvider/>
        </div>
    );
}

export default App;