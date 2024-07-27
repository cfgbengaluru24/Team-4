import axios from 'axios';

export default function registerSW({user} ) {
  
  
  Notification.requestPermission().then(permission => {
    console.log("dhfksdhfksjdfhjdsjkjf");
    if (permission === 'granted') {
      subscribeUser({user});
    }
  });
  }
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
function subscribeUser({user}) {
  console.log(user);
  const publicVapidKey = import.meta.env.VITE_APP_PUBLIC_VAPID_KEY;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      };
      registration.pushManager.subscribe(options).then(async function  (subscription) {
        console.log('User is getting subscribed:', subscription);
        await axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/api/notification/subscribe`, { subscription, user });
        console.log('User is subscribed.');
      }).catch(function (error) {
        console.error('Failed to subscribe user:', error);
      });
    });
  }
}