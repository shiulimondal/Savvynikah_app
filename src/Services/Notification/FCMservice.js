import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { Platform, AppState } from 'react-native';

class FCMService {
  constructor() {
    this.messageListener = null;
    this.processedNotifications = {}; // Store processed notifications
  }

  register = async (onRegister, onNotification, onOpenNotification) => {
    if (Platform.OS === 'ios') {
      await this.registerAppWithFCM();
    }
    this.checkPermission(onRegister);
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
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
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken Rejected', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission({
        sound: true,
        announcement: true,
      })
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission Rejected', error);
      });
  };

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    // Handle notifications when the app is opened from the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('[FCMService] OnNotificationOpenedApp', remoteMessage);
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    // Handle notifications when the app is launched from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('[FCMService] getInitialNotification', remoteMessage);
        if (remoteMessage) {
          onOpenNotification(remoteMessage);
        }
      });

    // Foreground state message listener
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A new FCM message arrived', remoteMessage);
      if (remoteMessage) {
        onNotification(remoteMessage);
      }
    });

    // Handle token refresh
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
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'resturentwalaz_owner',
    name: 'ResturentWalazOwner',
    sound: 'default',
  });

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

  // Ensure the notification is not duplicated
  const notificationId = notify?.messageId; // Get the unique notification ID

  if (notificationId && !fcmService.processedNotifications[notificationId]) {
    fcmService.processedNotifications[notificationId] = true; // Mark the notification as processed
    
    if (AppState.currentState === 'active' && notify.notification) {
      // Show notification only in the foreground
      onDisplayNotification(notify.notification.title, notify.notification.body);
    }
  } else {
    console.log('[App] Duplicate notification ignored');
  }
};

const onOpenNotification = (notify) => {
  console.log('notify', notify);
  const notiData = notify?.data;
  onclickNotification(notiData);
};

const onclickNotification = (data) => {
  console.log('data-----------------', data);
};

const onForegroundEvent = (data) => {
  const { type, detail } = data;
  if (type === EventType.PRESS) {
    const notiData = detail?.notification?.data;
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
