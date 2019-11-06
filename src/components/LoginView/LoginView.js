import React from "react";
import { getAuth } from "../../common/firebase";

class LoginView extends React.Component {
  state = {
    loginInputValue: "",
    passwordInputValue: "",
    loading: false
  };

  handleInputChange = (e, inputType) => {
    if (inputType === "login") {
      this.setState({
        loginInputValue: e.target.value
      });
    } else {
      this.setState({
        passwordInputValue: e.target.value
      });
    }
  };

  sendForm = async e => {
    const { loginInputValue, passwordInputValue } = this.state;
    e.preventDefault();
    const auth = await getAuth();
    auth
      .signInWithEmailAndPassword(loginInputValue, passwordInputValue)
      .then(res =>
        this.props.history.push({
          pathname: "/panel",
          state: { isUserLogged: true }
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    const auth = getAuth();
  }

  render() {
    const { loginInputValue, passwordInputValue } = this.state;

    return (
      <form action="/login" method="post">
        <input
          type="text"
          name="login"
          placeholder="Login"
          value={loginInputValue}
          onChange={e => {
            this.handleInputChange(e, "login");
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={passwordInputValue}
          ref="input"
          onChange={e => {
            this.handleInputChange(e, "password");
          }}
        />
        <button onClick={this.sendForm}>Wyślij</button>
      </form>
    );
  }
}

export default LoginView;
