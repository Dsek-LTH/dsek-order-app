import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ActivityIndicator, Provider } from 'react-native-paper';
import { setNotificationHandler } from 'expo-notifications';
import Orders from './components/Orders';
import { fetchAllOrders } from './src/api';
import { Order } from './src/types';
import { useInterval } from './src/utils';

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

  const noOrders =
    !loading && unfinishedOrders.length === 0 && finishedOrders.length === 0;

  useInterval(
    () => {
      fetchAllOrders().then((data) => {
        if (data) {
          setUnfinishedOrders(data.unfinishedOrders);
          setFinishedOrders(data.finishedOrders);
          const unfinishedOrders = data.unfinishedOrders;
          const finishedOrders = data.finishedOrders;
          const allOrders = [...unfinishedOrders, ...finishedOrders];
          if (selectedOrderId !== undefined) {
            if (!allOrders.map((order) => order.id).includes(selectedOrderId)) {
              console.log(selectedOrderId, 'not found anywhere');
              setSelectedOrderId(undefined);
            } else if (
              finishedOrders.map((order) => order.id).includes(selectedOrderId)
            ) {
              //console.log(finishedOrders);
              console.log(selectedOrderId, ' found in ', finishedOrders);
              setSelectedOrderId(undefined);
            }
          }
        }
        setLoading(false);
      });
    },
    1000,
    [selectedOrderId]
  );

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>
          {selectedOrderId === undefined
            ? 'Tryck på en order för att subscriba!'
            : `Du kommer få en notis när ${selectedOrderId} är klar!`}
        </Text>
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
          selectedOrderId={selectedOrderId}
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
