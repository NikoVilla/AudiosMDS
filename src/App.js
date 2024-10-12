import './App.css';
import Player1 from './components/Player1';
import logo from './logo-b-MDS-casino-oso.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Player1/>
      </header>
    </div>
  );
}

export default App;
