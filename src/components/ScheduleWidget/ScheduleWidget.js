import React from "react";
import "./ScheduleWidget.scss";

const ScheduleWidget = props => {
  const { isDataReady, isDataFetchingError, data } = props;

  return (
    <section className={`schedule${isDataReady ? " schedule--active" : ""}`}>
      {isDataReady && props.generateMassSchedule(data)}
      {isDataReady && props.generateTimetable(data)}
    </section>
  );
};

export default ScheduleWidget;
