import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as microsoftTeams from '@microsoft/teams-js';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [teamsUser, setTeamsUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Fetch fake users (you can replace this with your actual API call)
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users", err));
  }, []);

  // Initialize Teams SDK, get context, and then get auth token
  useEffect(() => {
    microsoftTeams.app.initialize()
      .then(() => {
        console.log("✅ Teams app initialized");
        return microsoftTeams.app.getContext();
      })
      .then(context => {
        console.log("🙍 User info:", context.user);
        setTeamsUser(context.user);

        // Get auth token for API calls
        microsoftTeams.authentication.getAuthToken({
          successCallback: (token) => {
            console.log("🔑 Auth token acquired:", token);
            setAuthToken(token);
            setAuthError(null);

            // Example: Use the token to call your own backend or Microsoft Graph
            // axios.get('/your-protected-api', { headers: { Authorization: `Bearer ${token}` } })
            //   .then(...)
            //   .catch(...);
          },
          failureCallback: (error) => {
            console.error("❌ Failed to get auth token", error);
            setAuthError(error);
          }
        });
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

      <hr />

      <h2>🔑 Authentication Token</h2>
      {authToken ? (
        <textarea
          readOnly
          rows={5}
          style={{ width: '100%' }}
          value={authToken}
        />
      ) : authError ? (
        <p style={{ color: 'red' }}>Error acquiring token: {authError}</p>
      ) : (
        <p>Loading auth token...</p>
      )}
    </div>
  );
}

export default App;
