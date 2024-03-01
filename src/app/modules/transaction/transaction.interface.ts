export type ITransaction = {
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  type: string;
  status: string;
};

export type ICashout = {
  userId: string;
  agentId: string;
  amount: number;
  cashoutNumber:number;
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

export type ICashOutProps = {
  userId: string;
  agentNumber: string;
  amount: number;
  userPin: string;
};

// export type ICashIn = {
//   userId: string;
//   agentId: string;
//   amount: number;
//   agentPIN: string;
// };
