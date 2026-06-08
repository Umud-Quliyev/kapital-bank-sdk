export interface OrderTypeInfo {
  title: string;
}

export interface OrderDetails {
  id: number;
  status: string;
  prevStatus?: string;
  amount: number;
  currency: string;
  createTime: string;
  finishTime?: string;
  title?: string;
  description?: string;
  type?: OrderTypeInfo;
}

export interface GetOrderDetailsOptions {
  tranDetailLevel?: number;
  tokenDetailLevel?: number;
  orderDetailLevel?: number;
}