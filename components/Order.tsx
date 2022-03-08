import { Card, List } from 'react-native-paper';
import { Text } from 'react-native';
import { Order, SetSelectedOrderId } from '../src/types';

export default function OrderComponent({
  order,
  setSelectedOrderId,
}: {
  order: Order;
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
      }}
      onPress={() => {
        if (setSelectedOrderId) {
          setSelectedOrderId(order.id);
        }
      }}
    >
      <Text style={{ fontSize: 48, textAlign: 'center', width: '100%' }}>
        {order.id}
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', width: '100%' }}>
        {order.content}
      </Text>
    </Card>
  );
}
