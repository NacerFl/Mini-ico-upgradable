import logo from './logo.svg';
import './App.css';
import { Outlet,Link } from "react-router-dom";



function App() {

  
  const handleSubmit = async() => {
    alert('Le nom a été soumis : ' + this.state.value);
  };

  return (
    <div className="App">
      <header className="App-header">
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/registration2">Register and create Wallet</Link> |{" "}
        <Link to="/registration">Register with metamask </Link>|{" "}
        <Link to="/connector">Login</Link>

      </nav>
      <Outlet />
      </header>

      
    </div>
  );
}

export default App;
