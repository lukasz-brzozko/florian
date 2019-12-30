import React from "react";
import "./_ScheduleWidget.scss";
import Spinner from "../../common/Spinner/Spinner";
import ContentCell from "../ContentCell/ContentCell";
import SchedulePointer from "../SchedulePointer/SchedulePointer";
import { getDatabase } from "../../common/firebase";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { ReactComponent as HomeBtn } from "../../assets/home.svg";
import moment from "moment";

class ScheduleWidget extends React.Component {
  constructor() {
    super();
    this.weekdayOffset = 7;
    this.weeksOfCurrentYear = moment().isoWeeksInYear();
    this.date = null;
  }
  state = {
    data: null,
    isDataReady: false,
    isDataFetchingError: false,
    scheduleLoaderVisible: true,
    weekOfYear: null
  };

  checkScheduleStatus = async () => {
    let status;
    await fetch("/grafik")
      .then(res => res.json())
      .then(json => (status = json.status))
      .catch(err => console.log(err));
    // console.log(status);
    if (status === "ok") {
      this.getScheduleData();
    }
  };

  getScheduleData = async (name = "") => {
    try {
      const db = await getDatabase();

      db.ref(`data/${name}`).on("value", snapshot => {
        this.setState({
          isDataReady: true,
          data: snapshot.val(),
          isDataFetchingError: false,
          scheduleLoaderVisible: false
        });
      });
    } catch (err) {
      this.setState({
        isDataFetchingError: true
      });
      console.log(err);
      setTimeout(this.getScheduleData, 10000);
    }
  };
  generateMassSchedule = data => {
    const { masses } = data;
    masses.sort((a, b) => {
      return parseFloat(a.time) - parseFloat(b.time);
    });
    const array = masses.map((item, index) => (
      <ContentCell modifier="mass" key={index}>
        {item.time}
      </ContentCell>
    ));
    return array;
  };
  generateTimetable = (data, weekOfYear, modifierName = "") => {
    const {
      masses,
      people,
      // activeVariantId,
      activeCaseID,
      scheduleWeekCases
    } = data;
    // const week = moment().isoWeek();
    const moduloOfCurrentWeek = weekOfYear % 3;

    const activeVariantId = scheduleWeekCases[activeCaseID].cases.find(
      el => el.moduloWeekValue === moduloOfCurrentWeek
    ).variantId;
    let counter = 0;
    const array = [];

    for (let i = activeVariantId; i < masses.length + activeVariantId; i++) {
      if (!people[i]) {
        if (!people[counter]) {
          counter = 0;
        }

        array.push(
          <ContentCell key={i} modifier={`variant-${activeVariantId}`}>
            {people[counter++].name}
          </ContentCell>
        );
        continue;
      }
      array.push(
        <ContentCell key={i} modifier={`variant-${activeVariantId}`}>
          {people[i].name}
        </ContentCell>
      );
    }
    return array;
  };

  setDateFromTheWeekOfYear = () => {
    if (!this.state.weekOfYear) {
      const week = moment().isoWeek();
      this.setState({ weekOfYear: week });
    }
    const date = moment().isoWeekday(this.weekdayOffset)._d;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.date = `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year} r.`;
  };
  changeWeekOfYear = (direction = 1) => {
    if (direction === 1) {
      if (this.state.weekOfYear === this.weeksOfCurrentYear) return;
      this.weekdayOffset += 7;
      this.setState(prevState => ({ weekOfYear: prevState.weekOfYear + 1 }));
    } else if (direction === -1) {
      if (this.state.weekOfYear === 1) return;

      this.weekdayOffset -= 7;
      this.setState(prevState => ({ weekOfYear: prevState.weekOfYear - 1 }));
    } else {
      if (this.weekdayOffset === 7) return;
      this.weekdayOffset = 7;
      const week = moment().isoWeek();
      this.setState({ weekOfYear: week });
    }
    this.setDateFromTheWeekOfYear();
  };

  removeDatabaseListener = async () => {
    const db = await getDatabase();
    db.ref("data").off("value");
  };
  componentDidMount() {
    this.setDateFromTheWeekOfYear();
    this.checkScheduleStatus();
  }
  componentWillUnmount() {
    this.removeDatabaseListener();
  }
  render() {
    const { isDataReady, data, weekOfYear } = this.state;
    const {
      generateMassSchedule,
      generateTimetable,
      changeWeekOfYear,
      weeksOfCurrentYear
    } = this;
    let massesArray;
    if (isDataReady) {
      massesArray = generateTimetable(data, weekOfYear);
    }

    return (
      <>
        <section className="schedule">
          <p className="schedule__date">{isDataReady && this.date}</p>
          <div
            className={`schedule__container${
              isDataReady ? " schedule__container--active" : ""
            }`}
          >
            {isDataReady && generateMassSchedule(data)}
            {massesArray}
            {massesArray && this.weekdayOffset === 7 && <SchedulePointer />}
            {!isDataReady && <Spinner dimensions={"30%"} />}
          </div>
          {isDataReady && (
            <div className="schedule__button-container">
              <Arrow
                className={`schedule__button schedule__button--previous${
                  weekOfYear === 1 ? " schedule__button--hidden" : ""
                }`}
                onClick={e => {
                  changeWeekOfYear(-1);
                }}
              />

              <HomeBtn
                className="schedule__button schedule__button--actual"
                onClick={e => {
                  changeWeekOfYear(0);
                }}
              />
              <Arrow
                className={`schedule__button schedule__button--next${
                  weekOfYear === weeksOfCurrentYear
                    ? " schedule__button--hidden"
                    : ""
                }`}
                onClick={e => {
                  changeWeekOfYear(1);
                }}
              />
            </div>
          )}
        </section>
      </>
    );
  }
}

export default ScheduleWidget;
