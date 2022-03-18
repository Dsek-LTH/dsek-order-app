import { View } from 'react-native';
import OrderComponent from './Order';
import { Order, SetSelectedOrderId } from '../src/types';

export default function Orders({
  orders,
  selectedOrderId,
  setSelectedOrderId,
}: {
  orders: Order[];
  selectedOrderId?: number;
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
          selectedOrderId={selectedOrderId}
          setSelectedOrderId={setSelectedOrderId}
        />
      ))}
    </View>
  );
}
