export interface IAnyJson {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface IOption {
  id: number;
  time: string;
  action: string;
  price: number;
  description: string;
}

export interface Ivariables {
  packageID: string;
  moduleName: string;
  queryOperationsAddEvent: string;
  queryOperationsDecreaseEvent: string;
  stackUsdcFunction: string;
  withdrawFunction: string;
}
