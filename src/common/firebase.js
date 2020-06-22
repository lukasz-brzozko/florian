import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/messaging";
import { getInfoAboutCurrentToken } from "./app-methods";

const config = {
  apiKey: "AIzaSyAXY1bMHBit2piaS7XrQyfeQbONnPdR1go",
  authDomain: "florian-8cd60.firebaseapp.com",
  databaseURL: "https://florian-8cd60.firebaseio.com",
  projectId: "florian-8cd60",
  storageBucket: "florian-8cd60.appspot.com",
  messagingSenderId: "1068675330484",
  appId: "1:1068675330484:web:09491bab381cc099dcc2e1",
  measurementId: "G-CDT4QQ1B3J",
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
    "BMUc5IQuAQkwMzhHBikKF9W7gpEWjaNYKLLeVXZpFN9lZ85YozpI55dTM53Mfm49c0inuEM5EaveHMYz7BB7wwc"
  );
  return messaging;
};

export const addOnMessageListener = async (messaging) => {
  const unsubscribeID = messaging.onMessage((payload) => {
    if (payload.notification) {
      alert(
        `Dodano nowe ogłoszenie: \n${payload.notification.body}. \nOdśwież stronę w celu odczytania ogłoszenia.`
      );
    } else {
      console.log("Message received. ", payload);
    }
  });
  return unsubscribeID;
};

export const getMessagingToken = async (messaging) => {
  const token = await messaging.getToken();
  // console.log(token);
  return token;
};

export const addTokenRefreshListener = async (messaging) => {
  // Callback fired if Instance ID token is updated.
  const unsubscribeID = messaging.onTokenRefresh(async () => {
    console.log("generating new token");
    const token = await getMessagingToken(messaging);
    getInfoAboutCurrentToken(token);
    return unsubscribeID;
  });
};
