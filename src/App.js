import React from "react";
import HomeView from "./components/HomeView/HomeView";
import LoginView from "./components/LoginView/LoginView";
import PanelView from "./components/PanelView/PanelView";

import { requestNotifyPermission } from "./common/app-methods";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

const App = () => {
  requestNotifyPermission();

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route path="/login" component={LoginView} />
        <Route path="/panel" component={PanelView} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
