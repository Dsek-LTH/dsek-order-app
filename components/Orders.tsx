import { View } from 'react-native';
import OrderComponent from './Order';
import { Order } from '../src/types';

export default function Orders({ orders }: { orders: Order[] }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {orders.map((order) => (
        <OrderComponent key={order.id} order={order} />
      ))}
    </View>
  );
}
