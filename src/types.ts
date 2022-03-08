export type Order = {
  id: number;
  content: string;
  isDone: boolean;
};

export type SetSelectedOrderId = React.Dispatch<
  React.SetStateAction<number | undefined>
>;
