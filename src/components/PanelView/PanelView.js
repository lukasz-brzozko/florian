import React from "react";
import { getAuth } from "../../common/firebase";

class PanelView extends React.Component {
  state = {
    loading: true,
    logged: false
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ logged: true });
      } else {
        this.props.history.push("/login");
      }
    });
    return ref;
  };
  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };

  getUnsubscribeRef = null;

  componentDidMount() {
    this.getUnsubscribeRef = this.addAuthListening();
  }

  componentWillUnmount() {
    this.getUnsubscribeRef();
  }

  render() {
    return (
      <>
        {this.state.logged && (
          <>
            <div>hejj</div>
            <button onClick={this.signUserOut}>Wyloguj</button>
          </>
        )}
      </>
    );
  }
}

export default PanelView;
