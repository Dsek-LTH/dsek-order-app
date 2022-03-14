import { Order } from './types';

const URL = 'https://dsek-order-app.herokuapp.com';

export const fetchAllOrders = async () => {
  const response = await fetch(`${URL}/orders`);
  const orders = (await response.json()) as Order[];
  const data = {
    unfinishedOrders: orders.filter((order) => !order.isDone),
    finishedOrders: orders.filter((order) => order.isDone),
  };
  return data;
};

export const subscribeToOrder = (id: number, token: string) =>
  fetch(`${URL}/order/subscribe`, {
    method: 'POST',
    body: JSON.stringify({ id, token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
