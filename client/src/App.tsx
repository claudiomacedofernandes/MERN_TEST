import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

import Photos from './components/Photos';
import Statistics from './components/Statistics';
import User from './components/User';

const App: React.FC = () => {
  const { username } = useAuth();

  return (
    <Router>
      <header style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Photos</Link>
        <Link to="/statistics">Statistics</Link>
        <Link to="/user">{username ?? 'Login/Register'}</Link>
      </header>

      <main style={{ padding: '1rem' }}>
        <Switch>
          <Route exact path="/" component={Photos} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/user" >
            <User />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
