import React from "react";
import { getAuth } from "../../common/firebase";

class PanelView extends React.Component {
  state = { isUserLogged: false };

  addAuthListening = async () => {
    const auth = await getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("zalogowany");
        this.setState({
          isUserLogged: true
        });
      } else {
        this.props.history.push("/login");
      }
    });
  };

  componentDidMount() {
    this.addAuthListening();
  }

  render() {
    return (
      <>
        {!this.state.isUserLogged && <p>BŁADDDDDDDDDDDDDDDDDDDDDDDDDDDDDD</p>}
        <div>Panel</div>
      </>
    );
  }
}

export default PanelView;
