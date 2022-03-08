import {
  BackgroundFetchResult,
  registerTaskAsync,
  unregisterTaskAsync,
} from 'expo-background-fetch';
import { defineTask, TaskManagerTaskBody } from 'expo-task-manager';
import { fetchAllOrders } from './api';
import { scheduleNotificationMealDone } from './notifications';
import { Order } from './types';

export const CHECK_ORDER_DONE = 'check-order-done';

let SELECTED_ORDER_ID: number | undefined = undefined;

defineTask(CHECK_ORDER_DONE, async () => {
  console.log('Fetching for order', SELECTED_ORDER_ID);
  const orders = await fetchAllOrders();
  const foundOrder = orders?.find((order) => order.id === SELECTED_ORDER_ID);
  console.log(foundOrder);
  if (foundOrder?.isDone) {
    scheduleNotificationMealDone(foundOrder);
    return BackgroundFetchResult.NewData;
  } else {
    return BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchSelectedOrder(orderId: number) {
  SELECTED_ORDER_ID = orderId;
  console.log('Registered background fetch for order: ', orderId);
  return registerTaskAsync(CHECK_ORDER_DONE, {
    minimumInterval: 1,
  });
}

export async function unregisterBackgroundFetchSelectedOrder() {
  console.log('Unregistered background fetch for order: ', SELECTED_ORDER_ID);
  return unregisterTaskAsync(CHECK_ORDER_DONE);
}
