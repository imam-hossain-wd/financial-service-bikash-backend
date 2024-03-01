
export type ICashin = {
  userId: string;
  agentId:string;
  cashInNumber:number;
  cashInAmount:number;
  fee: number;
  type: string;
  status: string;
};

export type ISendMoney = {
  userId: string;
  reciverId: string;
  senderNumber: string;
  reciverNumber: number;
  sendAmount:number;
  fee: number;
  type: string;
  status: string;
};

export type ICashout = {
  userId: string;
  agentId: string;
  amount: number;
  cashoutNumber: number;
  fee: number;
  type: string;
  status: string;
};

export type ICashOutProps = {
  userId: string;
  agentNumber: string;
  amount: number;
  userPin: string;
};

export type ISendMoneyProps = {
  userId: string;
  reciverNumber: string;
  userPin: string;
  amount: number;
};

export type ICashInProps = {
  agentId: string;
  userNumber: string;
  agentPin: string;
  amount: string;
};
