export const ENDPOINTS = {
  CREATE_ORDER: "/order",

  GET_ORDER: (id: number | string) =>
    `/order/${id}`,
  
  EXEC_TRAN: (id: number | string) =>
    `/order/${id}/exec-tran`,
  
  SET_SRC_TOKEN: (
    id: number | string,
    password: string
  ) =>
    `/order/${id}/set-src-token?password=${password}`,
} as const;
