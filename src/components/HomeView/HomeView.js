import React from "react";
import "./_HomeView.scss";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import ClassifiedsWidget from "../ClassifiedsWidget/ClassifiedsWidget";
import { Link } from "react-router-dom";

const HomeView = (props) => {
  return (
    <>
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
