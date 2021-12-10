import {ethers} from "ethers";
import { getNetwork } from '@ethersproject/networks';
import {EthereumNetwork} from "../utils/global";

function GetProvider(chainId: number) {
  return ethers.getDefaultProvider(getNetwork(chainId), {
    infura: process.env["PEOPLELAND_INFURA_KEY"] || "",
    alchemy: process.env["PEOPLELAND_ALCHEMY_KEY"] || "",
    etherscan: process.env["PEOPLELAND_ETHERSCAN_KEY"] || "",
  });
}

export class BaseContract {
  provider: any;
  metamaskProvider: any;
  contract: any;
  readContract: any;
  address: string;
  network: string;
  chainId: number;

  constructor(chainId: number, metamaskProvider: any) {
    this.provider = GetProvider(chainId);
    this.metamaskProvider = metamaskProvider;
    this.network = EthereumNetwork[chainId];
    this.chainId = chainId;
  }

}
