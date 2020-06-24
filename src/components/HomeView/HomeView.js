import React from "react";
import "./_HomeView.scss";
import ScheduleWidget from "../ScheduleWidget/ScheduleWidget";
import ClassifiedsWidget from "../ClassifiedsWidget/ClassifiedsWidget";
import LogoNavigator from "../../common/LogoNavigator/LogoNavigator";
import { Link } from "react-router-dom";

const HomeView = (props) => {
  return (
    <>
      <nav className=" nav header__link-container">
        <Link to="/login" className="header__login-link">
          Zaloguj
        </Link>
      </nav>
      <ScheduleWidget />
      <ClassifiedsWidget />
      <LogoNavigator />
    </>
  );
};

export default HomeView;
