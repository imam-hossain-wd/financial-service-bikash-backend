export type ITransaction = {
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  type: string;
  status: string;
};

export type ITransactionProps = {
  id: string;
  number: string;
  amount: string;
  pin: string;
};

// export type ICashOut = {
//   userId: string;
//   agentId: string;
//   amount: number;
// };

// export type ICashIn = {
//   userId: string;
//   agentId: string;
//   amount: number;
//   agentPIN: string;
// };
