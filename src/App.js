import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "./components/Lobby";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Lobby} />
        <Route path="/chat" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
