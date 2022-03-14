import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { Order } from './types';

/*
export async function scheduleNotificationMealDone(order: Order) {
  await scheduleNotificationAsync({
    content: {
      title: 'Din mat är klar 🍽️',
      body: `Nu kan du gå och hämta beställning #${order.id}`,
    },
    trigger: null,
  });
}
*/

export async function registerForPushNotifications() {
  let token;
  if (isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
