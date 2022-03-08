import { Order } from './types';

const API_URL = 'https://dsek-queue.herokuapp.com/api';

export const fetchAllOrders = async () => {
  const response = await fetch(API_URL);
  if (response.ok) {
    const data: Order[] = await response.json();
    return data;
  }
};
