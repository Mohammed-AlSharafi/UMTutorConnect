import styles from './App.module.css';
import Authentication from './pages/Authentication/Authentication';
import Communication from './pages/Communication/Communication';
import Header from './components/Header/Header';
import Profile from './pages/Profile';
import Home from './pages/Home/Home';

function App() {
  return <div className={styles.app}>
    <Header />
    {/*<Home/>*/}
    <Communication />
    {/* <Profile /> */}
    </div>;
}

export default App;
