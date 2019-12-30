import React from "react";
import "./_HomeView.scss";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import ClassifiedsWidget from "../ClassifiedsWidget/ClassifiedsWidget";
import { Link } from "react-router-dom";

const HomeView = props => {
  // createAllTimetableVariants = () => {
  //     generateTimetable(timetableWeeks.FIRSTWEEK, 'first-week')
  //     generateTimetable(timetableWeeks.SECONDWEEK, 'second-week')
  //     generateTimetable(timetableWeeks.THIRDWEEK, 'third-week')
  // }

  return (
    <>
      {/* <header className="topbar">
        <div className="topbar__container">
          <p className="topbar__date">Data</p>
        </div>
      </header> */}
      <div className="header__link-container">
        <Link to="/login" className="header__login-link">
          Zaloguj
        </Link>
      </div>
      <ScheduleWidget />
      <ClassifiedsWidget />
    </>
  );
};

export default HomeView;
