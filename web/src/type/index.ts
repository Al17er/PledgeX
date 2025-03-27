import { MoveStruct } from "@mysten/sui/client";

export interface IAnyJson {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface IOption {
  id: string;
  time: string;
  action: string;
  price: number;
  description: string;
}

export interface IparsedJson {
  ns_price: string;
  time: string;
}

export interface IContent {
  dataType: string;
  fields: MoveStruct;
  hasPublicTransfer: boolean;
  type: string;
}

export interface IBPFields {
  coin_ns: string;
  coin_usdc: string;
  id: { id: string };
  swap_ns: string;
  swap_usdc: string;
}
export interface IPPFields {
  id: { id: string };
  projectCoin: string;
}

export interface Ivariables {
  packageID: string;
  NEWPackageID: string;
  moduleName: string;
  queryOperationsAddEvent: string;
  queryOperationsDecreaseEvent: string;
  stackUsdcFunction: string;
  withdrawFunction: string;
}
