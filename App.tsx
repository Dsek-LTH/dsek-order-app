import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ActivityIndicator, Provider } from 'react-native-paper';
import { setNotificationHandler } from 'expo-notifications';
import Orders from './components/Orders';
import { fetchAllOrders } from './src/api';
import { Order } from './src/types';
import { useInterval } from './src/utils';
import {
  registerForPushNotifications,
  scheduleNotificationMealDone,
} from './src/notifications';
import { Subscription } from 'expo-modules-core';
import { BackgroundFetchStatus, getStatusAsync } from 'expo-background-fetch';
import { isTaskRegisteredAsync } from 'expo-task-manager';
import {
  CHECK_ORDER_DONE,
  registerBackgroundFetchSelectedOrder,
  unregisterBackgroundFetchSelectedOrder,
} from './src/backgroundFetch';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [unfinishedOrders, setUnfinishedOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>();

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      registerBackgroundFetchSelectedOrder(selectedOrderId);
    }
  }, [selectedOrderId]);

  const noOrders =
    !loading && unfinishedOrders.length === 0 && finishedOrders.length === 0;

  useEffect(() => {
    const orders = [...finishedOrders, ...unfinishedOrders];
    if (selectedOrderId) {
      const selectedOrder = orders.find(
        (order) => order.id === selectedOrderId
      );
      if (selectedOrder) {
        if (selectedOrder.isDone) {
          setSelectedOrderId(undefined);
          unregisterBackgroundFetchSelectedOrder();
        }
      } else {
        setSelectedOrderId(undefined);
        unregisterBackgroundFetchSelectedOrder();
      }
    }
  }, [finishedOrders]);

  useInterval(() => {
    fetchAllOrders().then((orders) => {
      if (orders) {
        setUnfinishedOrders(orders.filter((order) => !order.isDone));
        setFinishedOrders(orders.filter((order) => order.isDone));
      }
      setLoading(false);
    });
  }, 1000);

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {selectedOrderId && (
          <Text>Du kommer få en notis när {selectedOrderId} är klar</Text>
        )}
        {loading && (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Text style={{ marginBottom: 16, fontSize: 16 }}>Laddar...</Text>
            <ActivityIndicator animating={loading} size="large" />
          </View>
        )}
        {noOrders && (
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Text style={{ marginBottom: 16, fontSize: 16 }}>
              Hittar inga beställningar
            </Text>
          </View>
        )}
        {finishedOrders.length > 0 && (
          <Text style={{ fontSize: 48, marginBottom: 32, marginTop: 16 }}>
            Färdigt
          </Text>
        )}
        <Orders orders={finishedOrders} />
        {unfinishedOrders.length > 0 && (
          <Text style={{ fontSize: 48, marginBottom: 32, marginTop: 16 }}>
            Tillagas
          </Text>
        )}
        <Orders
          orders={unfinishedOrders}
          setSelectedOrderId={setSelectedOrderId}
        />
        <StatusBar style="auto" />
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 48,
    minHeight: '100%',
  },
});
