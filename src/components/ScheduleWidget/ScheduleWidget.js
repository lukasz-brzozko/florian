import React from "react";
import SwiperCore, { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from "../../common/Spinner/Spinner";
import ContentCell from "../ContentCell/ContentCell";
import SchedulePointer from "../SchedulePointer/SchedulePointer";
import { getDatabase } from "../../common/firebase";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { ReactComponent as HomeBtn } from "../../assets/home.svg";
import moment from "moment";

import 'swiper/swiper.scss';
import "./_ScheduleWidget.scss";

SwiperCore.use([Virtual]);
class ScheduleWidget extends React.Component {
  constructor() {
    super();
    this.weekdayOffset = 7;
    this.weeksOfCurrentYear = moment().isoWeeksInYear();
  }
  state = {
    data: null,
    date: null,
    isDataReady: false,
    isDataFetchingError: false,
    scheduleLoaderVisible: true,
    weekOfYear: null,
  };

  checkScheduleStatus = async () => {
    const timeZone = this.getTimeZone();
    let status;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeZone),
    };

    await fetch("/grafik", options)
      .then((res) => res.json())
      .then((json) => (status = json.status))
      .catch((err) => console.log(err));

    if (status === "ok") {
      this.getScheduleData();
    }
  };

  getScheduleData = async (name = "") => {
    const dbCommand = this.props.listening ? "on" : "once";

    try {
      const db = await getDatabase();

      db.ref(`data/${name}`)[dbCommand]("value", (snapshot) => {
        this.setState({
          isDataReady: true,
          data: snapshot.val(),
          isDataFetchingError: false,
          scheduleLoaderVisible: false,
        });
      });
    } catch (err) {
      this.setState({
        isDataFetchingError: true,
      });
      console.log(err);
      setTimeout(this.getScheduleData, 10000);
    }
  };

  getTimeZone = () => {
    const dayToMiliseconds = 86400000;

    const todayDate = new Date();
    const todayWithTimezone = todayDate.toTimeString();
    const todayGMTPosition = todayWithTimezone.indexOf("GMT");
    const todayGMTEndPosition = todayWithTimezone.indexOf(
      " ",
      todayGMTPosition
    );
    const todayTimeZone = todayWithTimezone.substring(
      todayGMTPosition,
      todayGMTEndPosition
    );

    const yesterdayWithTimezone = new Date(
      todayDate - dayToMiliseconds
    ).toTimeString();
    const yesterdayTimeZone = yesterdayWithTimezone.substring(
      todayGMTPosition,
      todayGMTEndPosition
    );

    return { todayTimeZone, yesterdayTimeZone };
  };

  generateMassSchedule = (data) => {
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
    const { masses, people, activeCaseID, scheduleWeekCases } = data;
    const moduloOfCurrentWeek = weekOfYear % 3;

    const activeVariantId = scheduleWeekCases[activeCaseID].cases.find(
      (el) => el.moduloWeekValue === moduloOfCurrentWeek
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

    this.setState({
      date: `${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month
        }.${year} r.`
    })
  };
  changeWeekOfYear = (direction = 1) => {
    if (direction === 1) {
      if (this.state.weekOfYear === this.weeksOfCurrentYear) return;
      this.weekdayOffset += 7;
      this.setState((prevState) => ({ weekOfYear: prevState.weekOfYear + 1 }));
    } else if (direction === -1) {
      if (this.state.weekOfYear === 1) return;

      this.weekdayOffset -= 7;
      this.setState((prevState) => ({ weekOfYear: prevState.weekOfYear - 1 }));
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
    const { isDataReady, data, date, weekOfYear } = this.state;
    const {
      generateMassSchedule,
      generateTimetable,
      changeWeekOfYear,
      weeksOfCurrentYear,
    } = this;
    let massesArray;
    if (isDataReady) {
      massesArray = generateTimetable(data, weekOfYear);
    }

    return (
      <>
        <section className="schedule">
          <Swiper
            speed={200}
            touchRatio={0.25}
            spaceBetween={100}
            slidesPerView={1}
            onTouchEnd={({ swipeDirection, touches }) => {
              const startX = Math.abs(touches.startX);
              const currentX = Math.abs(touches.currentX);
              const distance = Math.abs(startX - currentX);
              if (this.state.isDataReady && (distance > 50)) {
                swipeDirection === "next" ? changeWeekOfYear(1) : changeWeekOfYear(-1)
              }
            }}
          >
            <SwiperSlide>
              <div
                className={`schedule__container${isDataReady ? " schedule__container--active" : ""
                  }`}
              >

                <span className="schedule__date">{isDataReady && date}</span>
                {isDataReady && generateMassSchedule(data)}
                {massesArray}
                {massesArray && this.weekdayOffset === 7 && <SchedulePointer />}
                {!isDataReady && <Spinner dimensions={80} />}
              </div>
            </SwiperSlide>
          </Swiper>
          {isDataReady && (
            <div className="schedule__button-container">
              <Arrow
                className={`schedule__button schedule__button--previous${weekOfYear === 1 ? " schedule__button--hidden" : ""
                  }`}
                onClick={(e) => {
                  changeWeekOfYear(-1);
                }}
              />

              <HomeBtn
                className="schedule__button schedule__button--actual"
                onClick={(e) => {
                  changeWeekOfYear(0);
                }}
              />
              <Arrow
                className={`schedule__button schedule__button--next${weekOfYear === weeksOfCurrentYear
                  ? " schedule__button--hidden"
                  : ""
                  }`}
                onClick={(e) => {
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
