import styles from './App.module.css';
import Authentication from './pages/Authentication/Authentication';
import Communication from './pages/Communication/Communication';
import Header from './components/Header/Header';
import Profile from './pages/Profile';
import Home from './pages/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className={styles.app}>
          <Routes>
            {/* public routes */}
            <Route path="/authentication" element={<Authentication />} />

            {/* private routes */}
            <Route element={<PrivateRoute />} >
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/communication" element={<Communication />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
