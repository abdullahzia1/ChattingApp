import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomeScreen from "./pages/HomeScreen";
import ProtectedScreen from "./pages/ProtectedScreen";
import Login from "./pages/Login";
import Header from "./components/Header";
import TWO_FA from "./components/2FA";

// import AddPost from "./pages/AddPost";
import PrivateRoute from "./components/PrivateRoute";

import RootProvider from "./context/RootProvider";
import ChatApp from "./pages/ChatApp";
import RegisterScreen from "./pages/RegisterScreen";

function App() {
  return (
    <div className="App">
      <Router>
        <RootProvider>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomeScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/chatApp"
              element={
                <PrivateRoute>
                  <ChatApp />
                </PrivateRoute>
              }
            />
            <Route
              path="/protect"
              element={
                <PrivateRoute>
                  <ProtectedScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/2fa"
              element={
                <PrivateRoute>
                  <TWO_FA />
                </PrivateRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </RootProvider>
      </Router>
    </div>
  );
}

export default App;
