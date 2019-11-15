const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const serverMethods = require("./src/common/server-methods");
const port = process.env.PORT || 3030;
let currentTimeZone = "GMT+0200";
let scheduleChanged = true;

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const indexRouter = require(path.join(__dirname, '/routes/index'));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/api/ogloszenia", async (req, res) => {
  //PRZENIEŚĆ DO '/'
  const todayTimeZone = await serverMethods.checkCurrentTimeZone(
    currentTimeZone
  );
  if (todayTimeZone) {
    currentTimeZone = todayTimeZone;
  }

  scheduleChanged = serverMethods.checkScheduleChanging(scheduleChanged);

  //ZOSTAJE
  const response = await serverMethods.sendClassifieds();
  res.json(response);
});
app.get("*", (req, res) => {
  res.redirect("/");
});

// app.use('/', indexRouter);

app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
