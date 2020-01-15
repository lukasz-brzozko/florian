import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/messaging";

const config = {
'YOUR FIRABSE CONFIG'
};

firebase.initializeApp(config);

export const getDatabase = () => {
  const db = firebase.database();
  return db;
};
export const getAuth = () => {
  const auth = firebase.auth();
  return auth;
};

export const getData = async (name = "") => {
  const db = await getDatabase();
  const data = await db.ref(`data/${name}`).once("value");
  return data.val();
};

export const getMessagingInstance = async () => {
  const messaging = await firebase.messaging();
  messaging.usePublicVapidKey(
    "YOUR PUBLIC VAPID KEY"
  );
  return messaging;
};

export const addOnMessageListener = async messaging => {
  const unsubscribeID = messaging.onMessage(payload => {
    console.log("Message received. ", payload);
    // ...
  });
  return unsubscribeID;
};

export const getMessagingToken = async messaging => {
  const token = await messaging.getToken();
  return token;
};

export const addTokenRefreshListener = async messaging => {
  // Callback fired if Instance ID token is updated.
  const unsubscribeID = messaging.onTokenRefresh(async () => {
    console.log("generating new token");
    await getMessagingToken(messaging);
    // SUBSCRIBE TO THE TOPIC (SEND REQUEST TO THE SERVER)
    return unsubscribeID;
  });
};
