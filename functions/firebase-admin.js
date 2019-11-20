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
      email: "mail",
      emailVerified: false,
      phoneNumber: "phoneNumber",
      password: "password",
      displayName: "displayName",
      photoURL: "http://www.example.com/12345678/photo.png",
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
    console.log("poszło");
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

const firebaseAdmin = {
  getAdminDatabase,
  getAdminData,
  getEveningMassIndex,
  getEveningMassTime,
  getActiveVariantSchedule,
  setActiveVariantSchedule,
  changeEveningMassTime,
  addRoleForUser,
  showUsersRoles
};
module.exports = firebaseAdmin;
