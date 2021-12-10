import {BigNumber, ethers} from "ethers"
import {ADDRESS_ZERO, AirdropContractAddress, AirdropMerkleTree, TestAirdropContractAddress} from "../utils/global"
import AirdropABI from './abis/airdrop.json'
import {BaseContract} from "./index";
import keccak256 from "keccak256";
import {parseUnits} from "ethers/lib/utils";

export class AirdropContract extends BaseContract{

  constructor(chainId: number, metamaskProvider: any) {
    super(chainId, metamaskProvider)
    this.address = process.env.GATSBY_RUN_ENV === "DEV" ? TestAirdropContractAddress : AirdropContractAddress
    this.contract = new ethers.Contract(this.address, AirdropABI, this.metamaskProvider);
    this.readContract = new ethers.Contract(this.address, AirdropABI, this.provider);
  }

  async check() {
    const owner = await this.readContract.owner()
    if (!!owner && owner !== ADDRESS_ZERO) return
    throw new DOMException("Contract Error")
  }

  async getIsClaimed(total, account) {
    await this.check()
    const amountWei = parseUnits(total?.toString() || '0', 18);
    const node = ethers.utils.solidityPack(
      ["address", "uint256"],
      [account, amountWei]
    );
    const proof = AirdropMerkleTree.getHexProof(keccak256(node))
    return await this.contract.isClaimed(amountWei, account, proof)
  }

  async claimTokens(total: number, delegate: string) {
    await this.check()
    const amountWei = parseUnits(total?.toString() || '0', 18);
    const node = ethers.utils.solidityPack(
      ["address", "uint256"],
      [delegate, amountWei]
    );
    const proof = AirdropMerkleTree.getHexProof(keccak256(node))
    const signer = this.metamaskProvider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.claimTokens(amountWei, delegate, proof)
  }
}
