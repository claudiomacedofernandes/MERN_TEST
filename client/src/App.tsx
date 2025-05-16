import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/message');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  return (
    <div>
      <h1>React Client</h1>
      <button onClick={fetchMessage}>Get Message from Backend</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
