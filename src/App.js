import React, { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import StreamComponent from "./StreamComponent";
import "./App.css";

function App() {
  const [teamsUser, setTeamsUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState(null);  

  // Initialize Teams SDK, get context, and then get auth token
  useEffect(() => {
    microsoftTeams.app
      .initialize()
      .then(() => {
        console.log("✅ Teams app initialized");
        return microsoftTeams.app.getContext();
      })
      .then((context) => {
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
          },
        });
      })
      .catch((err) => {
        // console.error("❌ Teams initialization failed", err);
      });
  }, []);

  return (
    <div className="App">
      <StreamComponent />
    </div>
  );
}

export default App;
