import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import Home from './components/Home/index';
import Entries from './components/Entries';
import Entry from './components/Entry'
import Navbar from './components/Navbar';
import Graphs from './components/Graphs';
import Settings from './components/Settings';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';

const App = () => {
  const [user, setUser] = useState<any>({});
  const userRef = useRef();
  userRef.current = user;

  const appStyling = {
    backgroundColor: user ? user.accent_hex : '#d9b310', 
    color: user ? user.text_hex : '#d9b310', 
    minHeight: '100vh'
  }

  // Hardcoded userId for production
  useEffect(() => {
    axios.get('/api/users/1')
    .then((res) => setUser(res.data[0]))
    .catch(err => console.log('ERROR: ', err))
    }, [])


  return (
    <div className="App" style={appStyling}>
      <UserContext.Provider value={{ userRef, setUser }}>
        <Router>
          <nav
            style={{
              backgroundColor: user ? user.secondary_hex : 'rebeccapurple',
              color: user ? user.text_hex : 'rebeccapurple',
            }}>
            <Navbar />
          </nav>

          <Switch>
            <Route path="/entries/:entryId" component={Entry} />
            <Route path="/entries" component={Entries} />
            <Route path="/settings" component={Settings} />
            <Route path="/graphs" component={Graphs} />
            <Route path="/" component={Home} />
              
            <Redirect to="/" />
          </Switch>
        </Router >
      </UserContext.Provider>
    </div>
  );
};

export default App;