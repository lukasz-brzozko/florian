import React from "react";
import HomeView from "./HomeView/HomeView";
import LoginView from "./LoginView/LoginView";
import PanelView from "./PanelView/PanelView";

import { requestNotifyPermission } from "../common/app-methods";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
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
