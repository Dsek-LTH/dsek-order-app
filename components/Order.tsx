import { Card, List } from 'react-native-paper';
import { Text } from 'react-native';
import { Order } from '../src/types';

export default function OrderComponent({ order }: { order: Order }) {
  return (
    <Card
      style={{
        marginRight: 16,
        marginBottom: 16,
        minWidth: 128,
        maxWidth: 128,
        padding: 16,
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
