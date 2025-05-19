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
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container py-4 flex justify-between items-center">
            <nav className="flex space-x-4">
              <Link to="/photos" className="hover:text-blue-200 font-medium">Photos</Link>
              <Link to="/stats" className="hover:text-blue-200 font-medium">Statistics</Link>
            </nav>
            <Link to="/user" className="font-medium hover:text-blue-200">
              {username || 'Login/Register'}
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container py-6">
          <Switch>
            <Route path="/photos" component={Photos} />
            <Route path="/stats" component={Statistics} />
            <Route path="/user" component={User} />
            <Redirect from="/" to="/photos" />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;