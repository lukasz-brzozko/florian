const functions = require("firebase-functions");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const serverMethods = require("./server-methods");
// const port = process.env.PORT || 5000;
let currentTimeZone = "GMT+0200";

app.use(
  "/static",
  express.static(path.join(__dirname.replace("functions", "build")))
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const indexRouter = require(path.join(__dirname, '/routes/index'));
app.disable("x-powered-by");

app.get("/", async (req, res) => {
  res.sendFile("index.html", {
    root: __dirname.replace("functions", "build")
  });
});

app.get("/grafik", async (req, res) => {
  // console.log(scheduleChanged);
  const todayTimeZone = await serverMethods.checkCurrentTimeZone(
    currentTimeZone
  );
  if (todayTimeZone) {
    currentTimeZone = todayTimeZone;
  }

  // scheduleChanged = await serverMethods.checkScheduleChanging(scheduleChanged);
  res.json({ status: "ok" });
});
app.get("/api/ogloszenia", async (req, res) => {
  const response = await serverMethods.sendClassifieds();
  res.json(response);
});
app.get("*", (req, res) => {
  res.redirect(`/`);
});

// app.use('/', indexRouter);

// app.listen(port, () =>
//   console.log(`Server is listening on http://localhost:${port}`)
// );
exports.app = functions.https.onRequest(app);
