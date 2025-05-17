import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Photos from './components/Photos';
import Statistics from './components/Statistics';
import User from './components/User';

const App: React.FC = () => {
  // For demo, simple login state from localStorage or null
  const [user, setUser] = React.useState<string | null>(localStorage.getItem('username'));

  // Handler to update user state (for login/logout later)
  const handleUserChange = (username: string | null) => {
    if (username) localStorage.setItem('username', username);
    else localStorage.removeItem('username');
    setUser(username);
  };

  return (
    <AuthProvider>
      <Router>
        <header style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <Link to="/">Photos</Link>
          <Link to="/statistics">Statistics</Link>
          <Link to="/user">{user ?? 'Login/Register'}</Link>
        </header>

        <main style={{ padding: '1rem' }}>
          <Switch>
            <Route exact path="/" component={Photos} />
            <Route path="/statistics" component={Statistics} />
            <Route path="/user" >
              <User user={user} onUserChange={handleUserChange} />
            </Route>
            <Redirect to="/" />
          </Switch>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
