import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md">
          <Routes>
            <Route
              path="/"
              element={<WelcomePage setUserName={setUserName} />}
            />
            {/* Ajuste para aceitar roomId e token como parte da URL */}
            <Route
              path="/chat/:roomId"
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
