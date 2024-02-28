export type ITransaction = {
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  type: string;
  status: string;
};

export type ISendMonery = {
  senderId: string;
  number: string;
  amount: number;
  pin: string;
};

export type ICashOut = {
  userId: string;
  agentId: string;
  amount: number;
};

export type ICashIn = {
  userId: string;
  agentId: string;
  amount: number;
  agentPIN: string;
};
