
import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Episodes from './pages/Episodes';
import Hosts from './pages/Hosts';
import Producers from './pages/Producers';
import Shows from './pages/Shows';
import Streams from './pages/Streams';
import Subscribers from './pages/Subscribers';


function App() {
  document.title = 'TCG Database';
  return (
    <div className="App">
        <header className="App-header">
            <h1><article>The Code Giant</article> Podcast Network</h1>
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
         <footer>© Amy Fromandi and Ben Southcott 2022</footer>

    </div>
  );
}

export default App;
