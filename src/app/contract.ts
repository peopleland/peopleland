import {ethers} from "ethers"
import {ContractAddress, EthereumNetwork} from "../utils/global"
import ABI from './abi.json'

export class Contract {
  metamaskProvider: any;
  network: string;
  contract: any;

  constructor(network: string, metamaskProvider: any) {
    this.metamaskProvider = new ethers.providers.Web3Provider(metamaskProvider);
    this.network = network;
    this.contract = new ethers.Contract(ContractAddress, ABI, this.metamaskProvider);
  }

  async getGivedLand(address: string) {
    return await this.contract.givedLand(address);
  }

  async getMintLandCount(address: string) {
    return await this.contract.mintLandCount(address);
  }

  async mintToSelf() {}

}
