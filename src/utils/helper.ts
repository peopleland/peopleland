import {BigNumber, ethers} from "ethers";
import keccak256 from "keccak256";
import {MerkleTree} from "merkletreejs"

export function genAirdropMerkleTree(listData) {
  const elements = [];
  for (const address in listData) {
    const amount = listData[address].tol;
    const amountWei = BigNumber.from(10).pow(18).mul(amount);
    const value = ethers.utils.solidityPack(
      ["address", "uint256"],
      [address, amountWei]
    );
    elements.push(value);
  }

  return new MerkleTree(elements, keccak256, {
    hashLeaves: true,
    sort: true,
  });
}
