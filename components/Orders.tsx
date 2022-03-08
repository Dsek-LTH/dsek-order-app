import { View } from 'react-native';
import OrderComponent from './Order';
import { Order, SetSelectedOrderId } from '../src/types';

export default function Orders({
  orders,
  setSelectedOrderId,
}: {
  orders: Order[];
  setSelectedOrderId?: SetSelectedOrderId;
}) {
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
        <OrderComponent
          key={order.id}
          order={order}
          setSelectedOrderId={setSelectedOrderId}
        />
      ))}
    </View>
  );
}
