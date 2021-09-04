import { gsap } from "gsap";
import React from "react";

import AccordionContext from "../../common/contexts";
import { getDatabase } from "../../common/firebase";
import Spinner from "../../common/Spinner/Spinner";
import ClassifiedItem from "../ClassifiedItem/ClassifiedItem";

import "./_ClassifiedsWidget.scss";

class ClassifiedsWidget extends React.Component {
  classifiedsList = React.createRef();

  constructor(props) {
    super(props);

    this.togglePost = (postID) => {
      this.setState((prevState) => ({
        activePost: prevState.activePost === postID ? null : postID,
      }));
    };

    this.state = {
      activePost: null,
      togglePost: this.togglePost,
      classifiedsReady: false,
      classifieds: null,
    };
  }

  animateClassifieds = () => {
    const classifiedsList = this.classifiedsList?.current;
    const classifieds =
      classifiedsList?.getElementsByClassName("classifieds__item");
    if (classifieds !== undefined) {
      gsap.fromTo(
        classifieds,
        { autoAlpha: 0, x: -10 },
        {
          autoAlpha: 1,
          delay: 0.15,
          duration: 0.5,
          ease: "power1.inOut",
          stagger: 0.1,
          x: 0,
        }
      );
    }
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
    <AccordionContext.Provider value={this.state}>
      <ul className="classifieds__list">
        {posts.map((el, index) => (
          <ClassifiedItem key={index} id={index}>
            {el}
          </ClassifiedItem>
        ))}
      </ul>
    </AccordionContext.Provider>
  );
  componentDidMount() {
    this.getClassifieds();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.classifiedsReady !== this.state.classifiedsReady &&
      this.state.classifiedsReady
    ) {
      this.animateClassifieds();
    }
  }

  render() {
    const { classifieds, classifiedsReady } = this.state;
    return (
      <section className="classifieds widget">
        <p className="classifieds__title widget__title">
          Ogłoszenia duszpasterskie
        </p>
        <div className="classifieds__wrapper" ref={this.classifiedsList}>
          {classifiedsReady && this.generateClassifiedsList(classifieds)}
          {!classifiedsReady && <Spinner dimensions={80} />}
        </div>
      </section>
    );
  }
}

export default ClassifiedsWidget;
