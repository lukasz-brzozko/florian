const firebaseAdmin = require("./firebase-admin");
const fetch = require("node-fetch");
const convert = require("xml-js");

const checkCurrentTimeZone = async (timeZone) => {
  const { todayTimeZone, yesterdayTimeZone } = timeZone;

  const currentTimeZone = await firebaseAdmin.getAdminData("currentTimeZone");

  if (todayTimeZone !== currentTimeZone) {
    if (todayTimeZone === yesterdayTimeZone) {
      if (todayTimeZone === "GMT+0200") {
        firebaseAdmin.changeEveningMassTime("18:00");
      } else {
        firebaseAdmin.changeEveningMassTime("17:00");
      }
      await firebaseAdmin.updateValue("data", "currentTimeZone", todayTimeZone);
    }
  }

  return todayTimeZone;
};

const sendClassifieds = async (postsCount = 4) => {
  let jsonData = null;
  const url = process.env.FETCH_URL;
  await fetch(url)
    .then((response) => response.text())
    .then((str) => convert.xml2json(str))
    .then((data) => JSON.parse(data))
    .then((data) =>
      data.elements[0].elements[0].elements
        .filter((el) => el.name === "item")
        .splice(0, postsCount)
    )
    .then((arr) => arr.map((el) => el.elements))
    .then((arr) => {
      const data = [];
      arr.forEach((arr2) =>
        data.push(
          arr2.filter((el) => {
            if (
              el.name === "title" ||
              el.name === "content:encoded" ||
              el.name === "pubDate"
            ) {
              return el;
            }
          })
        )
      );
      return { ...data };
    })
    .then((dataObject) => {
      const posts = [];
      for (const key in dataObject) {
        const title = dataObject[key].find((el) => el.name === "title")
          .elements[0].text;
        const content = dataObject[key].find(
          (el) => el.name === "content:encoded"
        ).elements[0].cdata;
        const pubDate = dataObject[key].find((el) => el.name === "pubDate")
          .elements[0].text;
        posts.push({
          title,
          content,
          pubDate,
        });
      }
      return posts;
    })
    .then((json) => (jsonData = json))
    .catch((err) => console.log(err));
  return jsonData;
};

const checkScheduleChanging = async (scheduleChanged) => {
  const date = new Date();
  const day = date.getDay();
  if (day === 0) {
    const currentTime = date.toLocaleTimeString();
    const eveningMassTime = await firebaseAdmin.getEveningMassTime();
    if (!scheduleChanged && currentTime > eveningMassTime) {
      const success = await firebaseAdmin.getActiveVariantSchedule();
      return success;
    }
  } else {
    if (scheduleChanged) {
      scheduleChanged = false;
    }
  }
};

const getInfoAboutUserToken = async (token, topic) => {
  const url = process.env.TOKEN_URL;
  const options = {
    method: "GET",
    headers: {
      Authorization: `key=${process.env.TOKEN_KEY}`,
    },
  };
  let status;
  try {
    status = await fetch(`${url}${token}?details=true`, options);
    status = await status.json();
  } catch {
    return false;
  }
  if (status) {
    checkIsTopicSubscribed(status, token, topic);
    return true;
  }
};

const checkIsTopicSubscribed = async (info, token, topic) => {
  if (info.rel) {
    console.log(info.rel);
    const subscribedTopicsList = Object.getOwnPropertyNames(info.rel.topics);
    const subscribedToChosenTopic = subscribedTopicsList.includes(topic);
    if (!subscribedToChosenTopic) {
      await firebaseAdmin.subscribeUserToTopic(token, topic);
    }
  } else {
    await firebaseAdmin.subscribeUserToTopic(token, topic);
  }
};

module.exports = {
  checkCurrentTimeZone,
  sendClassifieds,
  checkScheduleChanging,
  getInfoAboutUserToken,
};
