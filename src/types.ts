export type Order = {
  id: number;
  orders: string[];
  isDone: boolean;
};

export type SetSelectedOrderId = React.Dispatch<
  React.SetStateAction<number | undefined>
>;
