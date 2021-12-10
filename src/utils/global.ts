import moment from "moment";
import testAirdropList from "../assets/json/test_airdrop_list.json"
import prodAirdropList from "../assets/json/prod_airdrop_list.json"
import {genAirdropMerkleTree} from "./helper";

export const EthereumNetwork = {
  1: 'homestead',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
};

export const AvailableNetwork = process.env.GATSBY_RUN_ENV === "DEV" ? 3 : 1

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const MintContractAddress = "0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b"
export const TESTMintContractAddress = "0xac6faA8065c6aC2FbF42ac21553F64c00181BD40"

export const BeginMintDatetime = moment.unix(1637933358)
// export const BeginMintDatetime = moment.unix(1638064800)

export const BeginAirdropDatetime = process.env.GATSBY_RUN_ENV === "DEV" ? moment.unix(0) : moment.unix(1639282332)
export const EndAirdropDatetime = moment.unix(1670818332)
export const AirdropList = process.env.GATSBY_RUN_ENV === "DEV" ? testAirdropList : prodAirdropList
export const AirdropMerkleTree = genAirdropMerkleTree(AirdropList)

export const AirdropContractAddress = "0x0000000000000000000000000000000000000000"
export const TestAirdropContractAddress = "0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b"
