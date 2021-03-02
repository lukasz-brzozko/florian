import React from "react";
import "./_LoginView.scss";
import * as firebase from "firebase/app";
import { getAuth, getDatabase } from "../../common/firebase";
import firebaseui from "firebaseui/dist/npm";
class LoginView extends React.Component {
  state = {
    loading: true,
  };

  generateFirebaseUI = () => {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl = "/panel") => {},
        uiShown: () => {
          this.setState({ loading: false });
        },
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,

      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      ],
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.history.replace("/panel");
      } else {
        this.generateFirebaseUI();
      }
    });
    return ref;
  };

  getUnsubscribeRef = null;

  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    return <div id="firebaseui-auth-container" className="firebaseui"></div>;
  }
}

export default LoginView;
