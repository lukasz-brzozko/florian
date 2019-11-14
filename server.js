const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const convert = require("xml-js");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3030;
const firebaseAdmin = require("./src/common/firebase-admin");
let currentTimeZone = "GMT+0200";

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const indexRouter = require(path.join(__dirname, '/routes/index'));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/ogloszenia", (req, res) => {
  console.log(currentTimeZone);
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
      currentTimeZone = todayTimeZone;
    }
  }

  const postsCount = 4;

  const sendResponse = () => {
    const url = "URL TO XML";
    fetch(url)
      .then(response => response.text())
      .then(str => convert.xml2json(str))
      .then(data => JSON.parse(data))
      .then(data =>
        data.elements[0].elements[0].elements
          .filter(el => el.name === "item")
          .splice(0, postsCount)
      )
      .then(arr => arr.map(el => el.elements))
      .then(arr => {
        const data = [];
        arr.forEach(arr2 =>
          data.push(
            arr2.filter(el => {
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
      .then(dataObject => {
        const posts = [];
        for (const key in dataObject) {
          const title = dataObject[key].find(el => el.name === "title")
            .elements[0].text;
          const content = dataObject[key].find(
            el => el.name === "content:encoded"
          ).elements[0].cdata;
          const pubDate = dataObject[key].find(el => el.name === "pubDate")
            .elements[0].text;
          posts.push({
            title,
            content,
            pubDate
          });
        }
        return posts;
      })
      .then(json => res.json(json));
  };
  sendResponse();
});
app.get("*", (req, res) => {
  res.redirect("/");
});

// app.use('/', indexRouter);

app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
