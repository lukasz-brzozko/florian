import React from "react";
import "./_PanelView.scss";
import { getAuth, getDatabase } from "../../common/firebase";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";

class PanelView extends React.Component {
  constructor() {
    super();
    this.getUnsubscribeRef = null;
    this.user = null;
  }
  state = {
    loading: true,
    logged: false,
    isAnonymous: false,
  };

  addAuthListening = () => {
    const auth = getAuth();
    const ref = auth.onAuthStateChanged((user) => {
      if (user) {
        const isAnonymous = user.isAnonymous;
        this.setState({
          logged: true,
          isAnonymous,
        });
      } else {
        this.props.history.replace("/login");
      }
    });
    return ref;
  };

  getActiveCaseID = async () => {
    let ID = null;
    const db = await getDatabase();
    await db.ref("data/activeCaseID").once(
      "value",
      (snap) => {
        ID = snap.val();
      },
      (err) => {
        console.log(err);
      }
    );
    return ID;
  };
  changeActiveCaseID = async () => {
    const db = await getDatabase();
    let currentCaseID = await this.getActiveCaseID();
    if (!currentCaseID && currentCaseID !== 0) {
    } else if (currentCaseID === 2) {
      currentCaseID = 0;
    } else {
      currentCaseID++;
    }
    if (!this.state.isAnonymous) {
      db.ref(`data`).update({ activeCaseID: currentCaseID }, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  };

  signUserOut = () => {
    const auth = getAuth();
    auth.signOut();
    this.props.history.goBack();
  };

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
            <section className="panel-view">
              <ScheduleWidget listening={true} />
              <div className="panel-view__button-container">
                <button
                  className="panel-view__button panel-view__button--danger"
                  onClick={this.signUserOut}
                >
                  Wyloguj
                </button>
                <button
                  className="panel-view__button"
                  onClick={this.changeActiveCaseID}
                  disabled={this.state.isAnonymous}
                >
                  Zmień rozkład
                </button>
              </div>
            </section>
          </>
        )}
      </>
    );
  }
}

export default PanelView;
