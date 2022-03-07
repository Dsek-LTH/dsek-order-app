import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ActivityIndicator, Provider } from 'react-native-paper';
import Orders from './components/Orders';
import { fetchAllData } from './src/api';
import { Order } from './src/types';
import { useInterval } from './src/utils';

export default function App() {
  const [unfinishedOrders, setUnfinishedOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const noOrders =
    !loading && unfinishedOrders.length === 0 && finishedOrders.length === 0;

  useInterval(() => {
    fetchAllData().then((orders) => {
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
        <Orders orders={unfinishedOrders} />
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
