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

  async getPrice() {
    return await this.contract.PRICE()
  }

  async mintToSelf(x: string, y: string, signInfo: any) {
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintToSelf(x, y, signInfo.hash, signInfo.v, signInfo.r, signInfo.s)
  }

  async mintAndGiveTo(x: string, y: string, givedAddress: string) {
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintAndGiveTo(x, y, givedAddress, {value: this.getPrice()})
  }

  async mintAndGiveToWithSlogan(x: string, y: string, givedAddress: string, slogan: string) {
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.mintAndGiveToWithSlogan(x, y, givedAddress, slogan, {value: this.getPrice()})
  }

}
