import React from "react";
import "./ScheduleWidget.scss";
import Spinner from "../../common/Spinner/Spinner";
import ContentCell from "../ContentCell/ContentCell";
import SchedulePointer from "../SchedulePointer/SchedulePointer";
import { getDatabase } from "../../common/firebase";
import moment from "moment";

// const ScheduleWidget = props => {
//   const { isDataReady, isDataFetchingError, data } = props;

//   return (
//     <section className={`schedule${isDataReady ? " schedule--active" : ""}`}>
//       {isDataReady && props.generateMassSchedule(data)}
//       {isDataReady && props.generateTimetable(data)}
//       {!isDataReady && <Spinner dimensions={"30%"} />}
//       <div className="schedule__pointer"></div>
//     </section>
//   );
// };

// export default ScheduleWidget;

class ScheduleWidget extends React.Component {
  state = {
    data: null,
    isDataReady: false,
    timetableRendered: false,
    isDataFetchingError: false,
    scheduleLoaderVisible: true
  };

  checkScheduleStatus = async () => {
    let status;
    await fetch("/grafik")
      .then(res => res.json())
      .then(json => (status = json.status))
      .catch(err => console.log(err));
    console.log(status);
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
        // this.generateTimetable(snapshot.val());
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
  generateTimetable = (data, modifierName = "") => {
    const {
      masses,
      people,
      // activeVariantId,
      activeCaseID,
      scheduleWeekCases
    } = data;
    const week = moment().isoWeek();
    const moduloOfCurrentWeek = week % 3;

    const activeVariantId = scheduleWeekCases[activeCaseID].cases.find(
      el => el.moduloWeekValue === moduloOfCurrentWeek
    ).variantId;
    console.log(activeVariantId);
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
    // this.setState({ timetableRendered: true });
    return array;
  };

  componentDidMount() {
    this.checkScheduleStatus();
  }
  render() {
    const { isDataReady, data } = this.state;
    const { generateMassSchedule, generateTimetable } = this;
    let massesArray;
    if (isDataReady) {
      massesArray = generateTimetable(data);
    }

    return (
      <section className={`schedule${isDataReady ? " schedule--active" : ""}`}>
        {isDataReady && generateMassSchedule(data)}
        {massesArray}
        {massesArray && <SchedulePointer />}
        {!isDataReady && <Spinner dimensions={"30%"} />}
        {/* {isDataReady &&  <SchedulePointer />} */}
      </section>
    );
  }
}

export default ScheduleWidget;
