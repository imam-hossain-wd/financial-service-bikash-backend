

export type ITransaction = {
    sender: string;
    receiver: string;
    amount: number;
    fee: number;
    type: string;
    status: string;
}

export type ISendMonery = {
    senderId: string, 
    receiverId: string,
     amount: number
}

export type ICashOut = {
    userId:string;
    agentId:string;
    amount:number
}

export type ICashIn = {
    userId:string,
     agentId:string, 
     amount:number, 
     agentPIN:string
}