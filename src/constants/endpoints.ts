export const ENDPOINTS = {
  CREATE_ORDER: "/order",

  GET_ORDER: (id: number | string) =>
    `/order/${id}`,
  
  EXEC_TRAN: (id: number | string) =>
    `/order/${id}/exec-tran`,
} as const;