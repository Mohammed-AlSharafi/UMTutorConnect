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
  useLocation,
  link,
} from "react-router-dom";
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';

import EditProfile from './pages/Profile/EditProfile';

// Add EditProfile route inside <PrivateRoute>
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/authentication';

  return (
    <div className={`${styles.app} ${!isAuthPage ? styles.withPadding : ''}`}>
      <Routes>
        {/* public routes */}
        <Route path="/authentication" element={<Authentication />} />

        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/communication" element={<Communication />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
