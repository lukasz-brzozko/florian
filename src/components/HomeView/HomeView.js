import React from "react";
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
      <Link to="/login">Login</Link>
      <header className="topbar">
        <div className="topbar__container">
          <p className="topbar__date">Data</p>
        </div>
      </header>
      <ScheduleWidget />
      <ClassifiedsWidget />
    </>
  );
};

export default HomeView;
