import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as microsoftTeams from '@microsoft/teams-js';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [teamsUser, setTeamsUser] = useState(null);

  // Fetch fake users
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users", err));
  }, []);

  // Initialize Microsoft Teams and get user context
  useEffect(() => {
    microsoftTeams.app.initialize()
      .then(() => {
        console.log("✅ Teams app initialized");
        return microsoftTeams.app.getContext();
      })
      .then(context => {
        console.log("🙍 User info:", context.user);
        setTeamsUser(context.user);
      })
      .catch(err => {
        console.error("❌ Teams initialization failed", err);
      });
  }, []);

  return (
    <div className="App">
      <h1>👥 User List</h1>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> – {user.email}
          </li>
        ))}
      </ul>

      <hr />

      <h2>📌 Microsoft Teams User Info</h2>
      {teamsUser ? (
        <div>
          <p><strong>Name:</strong> {teamsUser.displayName}</p>
          <p><strong>Email:</strong> {teamsUser.email}</p>
          <p><strong>ID:</strong> {teamsUser.id}</p>
        </div>
      ) : (
        <p>Loading Teams context...</p>
      )}
    </div>
  );
}

export default App;
