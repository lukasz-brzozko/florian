import React from "react";
import "./_ClassifiedsWidget.scss";
import ClassifiedItem from "../ClassifiedItem/ClassifiedItem";
import { getDatabase } from "../../common/firebase";
import Spinner from "../../common/Spinner/Spinner";

class ClassifiedsWidget extends React.Component {
  state = {
    classifiedsReady: false,
    classifieds: null,
  };

  getClassifieds = async (postsCount = 4) => {
    const posts = [];
    const db = await getDatabase();
    await db
      .ref("/posts")
      .limitToLast(postsCount)
      .once(
        "value",
        (snap) => {
          const data = snap.val();

          for (const key in data) {
            posts.push(data[key]);
          }
          posts.reverse();
          this.setState({
            classifiedsReady: true,
            classifieds: posts,
          });
        },
        (err) => setTimeout(this.getClassifieds, 5000)
      );
  };

  generateClassifiedsList = (posts) => (
    <ul className="classifieds__list">
      {posts.map((el, index) => (
        <ClassifiedItem key={index}>{el}</ClassifiedItem>
      ))}
    </ul>
  );
  componentDidMount() {
    this.getClassifieds();
  }

  render() {
    const { classifieds, classifiedsReady } = this.state;
    return (
      <section className="classifieds widget">
        <p className="classifieds__title widget__title">
          Ogłoszenia duszpasterskie
        </p>
        <div className="classifieds__wrapper">
          {classifiedsReady && this.generateClassifiedsList(classifieds)}
          {!classifiedsReady && <Spinner dimensions={80} />}
        </div>
      </section>
    );
  }
}

export default ClassifiedsWidget;
