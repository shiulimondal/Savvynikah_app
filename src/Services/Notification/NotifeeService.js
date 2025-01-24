import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

class FCMService {
  constructor() {
    this.messageListener = undefined;
  }

  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          // User has permission
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission Rejected', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a devices token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken Rejected', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission Rejected', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] Delete Token');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete Token Error', error);
      });
  };

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] OnNotificationOpenedApp getInitialNotification',
        remoteMessage
      );
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification getInitialNotification',
          remoteMessage
        );
        if (remoteMessage) {
          onOpenNotification(remoteMessage);
        }
      });

    // Foreground state message
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A new FCM message arrived', remoteMessage);
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });

    // Triggered when have new Token
    messaging().onTokenRefresh((fcmToken) => {
      console.log('[FCMService] New token refresh', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    if (this.messageListener) {
      this.messageListener();
    }
  };
}

async function onDisplayNotification(title, body) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();
  
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'resturentwalaz_owner',
    name: 'ResturentWalazOwner',
    sound: 'default',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
}

const onNotification = (notify) => {
  console.log('[App] onNotification', notify);
  if (notify.notification) {
    onDisplayNotification(
      notify.notification.title,
      notify.notification.body
    );
  }
};

const onOpenNotification = async (notify) => {
  console.log('notify', notify);
  let notiData = notify?.data;
  onclickNotification(notiData);
};

const onclickNotification = (data) => {
  console.log('data-----------------', data);
};

const onForegroundEvent = (data) => {
  const { type, detail } = data;
  if (type === EventType.PRESS) {
    let notiData = detail?.notification?.data;
    onclickNotification(notiData);
  }
};

export const fcmService = new FCMService();

export {
  onDisplayNotification,
  onNotification,
  onOpenNotification,
  onForegroundEvent,
};
