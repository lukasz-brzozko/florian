import React from "react";
import HomeView from "./components/HomeView/HomeView";
import LoginView from "./components/LoginView/LoginView";
import PanelView from "./components/PanelView/PanelView";
import {
  getMessagingInstance,
  getMessagingToken,
  addOnMessageListener,
  addTokenRefreshListener
} from "./common/firebase";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

const App = () => {
  const requestNotifyPermission = () => {
    Notification.requestPermission().then(async permission => {
      if (permission === "granted") {
        console.log("Notification permission granted.");

        const messaging = await getMessagingInstance();
        const token = await getMessagingToken(messaging);

        //SUBSCRIBE USER

        addOnMessageListener(messaging);
        addTokenRefreshListener(messaging);
        return token;
      } else {
        console.log("Unable to get permission to notify.");

        //UNSUBSCRIBE USER
      }
    });
  };

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
