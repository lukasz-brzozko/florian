const firebaseAdmin = require("./firebase-admin");
const fetch = require("node-fetch");
const moment = require("moment");
const schedule = require("node-schedule");
// const convert = require("xml-js");

const checkCurrentTimeZone = currentTimeZone => {
  const dayToMiliseconds = 86400000;

  const todayDate = new Date();
  const todayWithTimezone = todayDate.toTimeString();
  const todayGMTPosition = todayWithTimezone.indexOf("GMT");
  const todayGMTEndPosition = todayWithTimezone.indexOf(" ", todayGMTPosition);
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

  if (todayTimeZone !== currentTimeZone) {
    if (todayTimeZone === yesterdayTimeZone) {
      if (todayTimeZone === "GMT+0200") {
        firebaseAdmin.changeEveningMassTime("18:00");
      } else {
        firebaseAdmin.changeEveningMassTime("17:00");
      }
      return todayTimeZone;
    }
  }
};

const checkScheduleChanging = async scheduleChanged => {
  const date = new Date();
  const day = date.getDay();
  if (day === 0) {
    const currentTime = date.toLocaleTimeString();
    const eveningMassTime = await firebaseAdmin.getEveningMassTime();
    console.log(currentTime, eveningMassTime);
    if (scheduleChanged === false && currentTime > eveningMassTime) {
      const success = await firebaseAdmin.getActiveVariantSchedule();
      return success;
    }
  } else {
    return false;
  }
};
module.exports = {
  checkCurrentTimeZone,
  checkScheduleChanging
};
