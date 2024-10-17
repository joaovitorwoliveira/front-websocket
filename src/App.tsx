import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";

function App() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-screen-xl">
          <Routes>
            <Route
              path="/"
              element={<WelcomePage setUserName={setUserName} />}
            />
            <Route
              path="/room/:roomId"
              element={
                userName ? (
                  <ChatPage userName={userName} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
