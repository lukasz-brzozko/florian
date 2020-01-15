import {
  getMessagingInstance,
  getMessagingToken,
  addOnMessageListener,
  addTokenRefreshListener
} from "./firebase";

export const requestNotifyPermission = () => {
  Notification.requestPermission().then(async permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");

      const messaging = await getMessagingInstance();

      const token = await getMessagingToken(messaging);

      addTokenRefreshListener(messaging);
      getInfoAboutCurrentToken(token);
      addOnMessageListener(messaging);
      return token;
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
};

export const getInfoAboutCurrentToken = async token => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token
    })
  };

  fetch("/getinfo", options);
};
