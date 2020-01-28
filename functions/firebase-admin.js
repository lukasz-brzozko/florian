const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-sdk.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://florian-8cd60.firebaseio.com"
});

const getAdminDatabase = () => {
  const db = app.database();
  return db;
};

const getAdminAuth = () => {
  const auth = app.auth();
  return auth;
};

const getAdminData = async (name = "") => {
  const db = await getAdminDatabase();
  const data = await db.ref(`data/${name}`).once("value");
  return data.val();
};

const getEveningMassIndex = async (name = "masses") => {
  const db = await getAdminDatabase();
  let allMasses;
  let eveningMassIndex;
  await db.ref(`data/${name}`).once("value", snap => {
    allMasses = snap.val();
    const eveningMassTime = Math.max
      .apply(
        Math,
        allMasses.map(mass => {
          return mass.time.replace(":", ".");
        })
      )
      .toFixed(2);

    eveningMassIndex = allMasses.findIndex(
      mass => mass.time.replace(":", ".") === eveningMassTime
    );
  });
  return eveningMassIndex;
};

const getEveningMassTime = async () => {
  const db = await getAdminDatabase();
  const index = await getEveningMassIndex();

  let data;
  await db
    .ref(`data/masses/${index}`)
    .once("value", snap => (data = snap.val()));
  return data.time;
};

const getActiveVariantSchedule = async () => {
  const db = await getAdminDatabase();
  await db.ref("data/activeCaseID").once(
    "value",
    async snap => {
      let activeCaseID = snap.val();
      if (activeCaseID === 2) {
        activeCaseID = 0;
      } else {
        activeCaseID++;
      }
      await setActiveVariantSchedule(activeCaseID);
    },
    err => {
      setTimeout(getActiveVariantSchedule, 5000);
    }
  );
};

const setActiveVariantSchedule = async activeCaseID => {
  let scheduleChanged = false;
  const db = await getAdminDatabase();
  await db.ref(`data`).update({ activeCaseID }, err => {
    if (!err) {
      scheduleChanged = true;
    } else {
      setTimeout(setActiveVariantSchedule, 5000);
    }
  });

  err => {
    setTimeout(setActiveVariantSchedule, 5000);
  };
  return scheduleChanged;
};

const changeEveningMassTime = async eveningMassTime => {
  const db = await getAdminDatabase();
  let index = await getEveningMassIndex();

  db.ref(`data/masses/${index}`).update({ time: eveningMassTime });
};

const addUser = async () => {
  const auth = await getAdminAuth();
  auth
    .createUser({
      uid: "uid",
      email: "email",
      emailVerified: false,
      phoneNumber: "phone number",
      password: "passowrd",
      displayName: "username",
      // photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
};
const addRoleForUser = async (uid, role = "admin") => {
  const auth = await getAdminAuth();
  auth.setCustomUserClaims(uid, { admin: true }).then(() => {
    console.log("Dodano rolę!");
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  });
};
const showUsersRoles = async uid => {
  const auth = await getAdminAuth();
  auth.getUser(uid).then(userRecord => {
    // The claims can be accessed on the user record.
    console.log(userRecord.customClaims);
  });
};

const subscribeUserToTopic = async (token, topic) => {
  app
    .messaging()
    .subscribeToTopic(token, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log("Successfully subscribed to topic:", response);
    })
    .catch(function(error) {
      console.log("Error subscribing to topic:", error);
    });
};
const unsubscribeUserFromTopic = async (token, topic) => {
  app
    .messaging()
    .unsubscribeFromTopic(token, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log("Successfully unsubscribed from topic:", response);
    })
    .catch(function(error) {
      console.log("Error unsubscribing from topic:", error);
    });
};

const sendMessageToTopic = async (target, title = "Florian", body) => {
  let key = "topic";
  if (target.length > 20) {
    key = "token";
  }

  const message = {
    notification: {
      title,
      body
    },
    webpush: {
      fcm_options: {
        // link: "https://florian-8cd60.firebaseapp.com/"
        link: "https://florian-8cd60.web.app"
      },
      headers: {
        TTL: "604800000",
        Urgency: "high"
      },
      notification: {
        title,
        body,
        icon: "favicon.png",
        requireInteraction: "true"
      }
    },
    android: {
      priority: "high"
    },
    [key]: target
  };
  try {
    app.messaging().send(message);
  } catch (err) {
    console.log(err.message);
  }
};

const firebaseAdmin = {
  getAdminDatabase,
  getAdminData,
  getEveningMassIndex,
  getEveningMassTime,
  getActiveVariantSchedule,
  setActiveVariantSchedule,
  changeEveningMassTime,
  addRoleForUser,
  showUsersRoles,
  subscribeUserToTopic,
  unsubscribeUserFromTopic,
  sendMessageToTopic
};
module.exports = firebaseAdmin;
