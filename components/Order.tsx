import { Card, List } from 'react-native-paper';
import { Text } from 'react-native';
import { Order, SetSelectedOrderId } from '../src/types';
import { registerForPushNotifications } from '../src/notifications';
import { subscribeToOrder, unsubscribeToOrder } from '../src/api';

export default function OrderComponent({
  order,
  selectedOrderId,
  setSelectedOrderId,
}: {
  order: Order;
  selectedOrderId?: number;
  setSelectedOrderId?: SetSelectedOrderId;
}) {
  return (
    <Card
      style={{
        marginRight: 16,
        marginBottom: 16,
        minWidth: 128,
        maxWidth: 128,
        padding: 16,
        backgroundColor: selectedOrderId === order.id ? '#F280A1' : 'white',
      }}
      onPress={() => {
        if (setSelectedOrderId) {
          registerForPushNotifications().then((token) => {
            if (token) {
              if (selectedOrderId && selectedOrderId !== order.id) {
                unsubscribeToOrder(selectedOrderId, token);
                subscribeToOrder(order.id, token)
                  .then((response) => {
                    setSelectedOrderId(order.id);
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else if (selectedOrderId === order.id) {
                unsubscribeToOrder(selectedOrderId, token).then(() => {
                  setSelectedOrderId(undefined);
                });
              } else {
                subscribeToOrder(order.id, token)
                  .then((response) => {
                    setSelectedOrderId(order.id);
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            }
          });
        }
      }}
    >
      <Text style={{ fontSize: 48, textAlign: 'center', width: '100%' }}>
        {order.id}
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', width: '100%' }}>
        {`[${order.orders.join(', ')}]`}
      </Text>
    </Card>
  );
}
