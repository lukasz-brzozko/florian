import React from "react";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import ContentCell from "../ContentCell/ContentCell";
import ClassifiedsWidget from "../ClassifiedsWidget/ClassifiedsWidget";
import ClassifiedItem from "../ClassifiedItem/ClassifiedItem";
import { DB } from "../../common/dbConstants";
import { getData, getDatabase } from "../../common/firebase";
const axios = require("axios").default;

class HomeView extends React.Component {
  state = {
    dataReady: false,
    classifiedsReady: false,
    isDataFetchingError: false,
    data: null,
    classifieds: null
  };

  // getScheduleData = async () => {
  //   try {
  //     const data = await getData();
  //     this.generateTimetable(data);
  //     this.setState({
  //       dataReady: true,
  //       data,
  //       isDataFetchingError: false
  //     });
  //   } catch (err) {
  //     this.setState({
  //       isDataFetchingError: true
  //     });
  //     console.log(err);
  //     setTimeout(this.getScheduleData, 10000);
  //   }
  // };
  getScheduleData = async (name = "") => {
    try {
      const db = await getDatabase();
      db.ref(`data/${name}`).on("value", snapshot => {
        this.setState({
          dataReady: true,
          data: snapshot.val(),
          isDataFetchingError: false
        });
        this.generateTimetable(snapshot.val());
      });
    } catch (err) {
      this.setState({
        isDataFetchingError: true
      });
      console.log(err);
      setTimeout(this.getScheduleData, 10000);
    }
  };

  getClassifieds = () => {
    axios
      .get("/ogloszenia")
      .then(res => res.data)
      .then(result =>
        this.setState({
          classifiedsReady: true,
          classifieds: result
        })
      );
  };
  // createAllTimetableVariants = () => {
  //     generateTimetable(timetableWeeks.FIRSTWEEK, 'first-week')
  //     generateTimetable(timetableWeeks.SECONDWEEK, 'second-week')
  //     generateTimetable(timetableWeeks.THIRDWEEK, 'third-week')
  // }

  generateMassSchedule = data => {
    const { masses } = data;
    const array = masses.map((item, index) => (
      <ContentCell modifier="mass" key={index}>
        {item.time}
      </ContentCell>
    ));
    return array;
  };

  generateTimetable = (data, modifierName = "") => {
    const { masses, people, activeVariantId } = data;
    let counter = 0;
    const array = [];

    for (let i = activeVariantId; i < masses.length + activeVariantId; i++) {
      if (!people[i]) {
        if (!people[counter]) {
          counter = 0;
        }

        array.push(
          <ContentCell key={i} modifier={modifierName}>
            {people[counter++].name}
          </ContentCell>
        );
        continue;
      }
      array.push(
        <ContentCell key={i} modifier={modifierName}>
          {people[i].name}
        </ContentCell>
      );
    }
    return array;
  };

  generateClassifiedsList = posts => (
    <ul className="classifieds__list">
      {posts.map((el, index) => (
        <ClassifiedItem key={index}>{el}</ClassifiedItem>
      ))}
    </ul>
  );

  componentDidMount() {
    //do testowania
    this.getScheduleData();
    this.getClassifieds();
    console.log("czesc");
  }
  render() {
    const {
      generateTimetable,
      generateMassSchedule,
      generateClassifiedsList,
      state
    } = this;
    const {
      data,
      classifieds,
      dataReady,
      classifiedsReady,
      isDataFetchingError
    } = state;
    return (
      <>
        <header className="topbar">
          <div className="topbar__container">
            <p className="topbar__date">Data</p>
          </div>
        </header>
        <ScheduleWidget
          generateTimetable={generateTimetable}
          generateMassSchedule={generateMassSchedule}
          data={data}
          isDataReady={dataReady}
          isDataFetchingError={isDataFetchingError}
        />
        <ClassifiedsWidget
          classifieds={classifieds}
          areClassifiedsReady={classifiedsReady}
          generateClassifiedsList={generateClassifiedsList}
        />
      </>
    );
  }
}

export default HomeView;
