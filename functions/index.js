require("dotenv").config();

const functions = require("firebase-functions");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const serverMethods = require("./server-methods");
const firebaseAdmin = require("./firebase-admin");
const subscribeTopic = "posts";

app.use(
  "/static",
  express.static(path.join(__dirname.replace("functions", "build")))
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.disable("x-powered-by");

app.get("/", async (req, res) => {
  res.sendFile("index.html", {
    root: __dirname.replace("functions", "build"),
  });
});

app.post("/grafik", async (req, res) => {
  const { body } = req;
  await serverMethods.checkCurrentTimeZone(body);

  res.json({ status: "ok" });
});
app.get("/api/ogloszenia", async (req, res) => {
  const response = await serverMethods.sendClassifieds();
  res.json(response);
});

app.post("/getinfo", async (req, res) => {
  const token = req.body.token;

  const success = await firebaseAdmin.subscribeUserToTopic(
    token,
    subscribeTopic
  );

  res.send(success);
});

app.post("/send", async (req, res) => {
  const auth = req.get("authorization");
  if (auth === process.env.SRV_PS) {
    const body = req.body;
    const { topic, title } = body;
    if (topic && title) {
      firebaseAdmin.sendMessageToTopic(topic, "Florian", title);
    }
    res.json(body);
  } else {
    return res.status(403).json({ error: "No credentials sent!" });
  }
});

app.get("*", (req, res) => {
  res.redirect(`/`);
});

exports.app = functions.https.onRequest(app);
