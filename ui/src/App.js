
import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/pages/HomePage';
import Episodes from './components/pages/Episodes';
import Hosts from './components/pages/Hosts';
import Producers from './components/pages/Producers';
import Shows from './components/pages/Shows';
import Streams from './components/pages/Streams';
import Subscribers from './components/pages/Subscribers';


function App() {
  document.title = 'Podcast Database';
  return (
    <div className="App">
        <header className="App-header">
            <h1>Podcast Network Business Database</h1>
        </header>
        <Router>
            <Navigation />
            <Route path='/' exact>
                <HomePage />
            </Route>
            <Route path='/episodes'>
                <Episodes />
            </Route>
            <Route path='/hosts'>
                <Hosts />
            </Route>
            <Route path='/producers'>
                <Producers />
            </Route>
            <Route path='/shows'>
                <Shows />
            </Route>
            <Route path='/streams'>
                <Streams />
            </Route>
            <Route path='/subscribers'>
                <Subscribers />
            </Route>
         </Router>
         <footer>© Ben Southcott 2022</footer>

    </div>
  );
}

export default App;
