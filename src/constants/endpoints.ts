export const ENDPOINTS = {
  CREATE_ORDER: "/order",

  GET_ORDER: (id: number | string) =>
    `/order/${id}`,
} as const;