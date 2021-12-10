import * as React from "react"
import * as styles from "./index.module.css"
import Guide from "../assets/guide.jpeg"
import Land from "../assets/land.png"
import {MintContract} from "../app/mintContract";
import prodWhiteAddress from "../assets/json/prod_address_sign_info.json";
import testWhiteAddress from "../assets/json/test_address_sign_info.json";
import sloganDescImg from "../assets/slogan_desc.png";
import moment from "moment";
import {BeginMintDatetime} from "../utils/global";
import Page from "../components/page";
import Button from "../components/button";
import {useMemo} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import {ethers} from "ethers";
// import {useWeb3React} from "@web3-react/core";

const IndexPage = () => {
  // const { library, account, chainId } = useWeb3React();
  const [metamaskProvider, setMetamaskProvider] = React.useState(null);
  const [chainId, setChainId] = React.useState<number>(null);
  const [account, setAccount] = React.useState<string>();

  React.useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true, timeout: 5000 }).then((v: any) => {
      if (!v) return
      setMetamaskProvider(v)
    })
  }, [])

  const connectMetamask = React.useCallback(() => {
    if (!metamaskProvider) {
      window.location.href = 'https://metamask.io/'
      return
    }
    metamaskProvider.request({ method: 'eth_chainId' }).then((cid: string) => {
      setChainId(parseInt(cid, 16))
    })
    metamaskProvider.request({ method: 'eth_requestAccounts' }).then((accs: any) => {
      setAccount(accs[0])
    })
  }, [metamaskProvider])

  const library = React.useMemo(() => {
    if (!metamaskProvider) return null
    return new ethers.providers.Web3Provider(metamaskProvider)
  }, [metamaskProvider])

  const [isGived, setIsGived] = React.useState<boolean>(false);
  const [landCount, setLandCount] = React.useState<number>(0);
  const [currentMoment, setCurrentMoment] = React.useState(moment());
  const [inWhiteList, setInWhiteList] = React.useState(false);

  const [mintX, setMintX] = React.useState("");
  const [mintY, setMintY] = React.useState("");
  const [inviteX, setInviteX] = React.useState("");
  const [inviteY, setInviteY] = React.useState("");
  const [inviteAddress, setInviteAddress] = React.useState("");
  const [inviteSlogan, setInviteSlogan] = React.useState("");

  const [customSlogan, setCustomSlogan] = React.useState("");

  const [loadingMint, setLoadingMint] = React.useState<boolean>(false);
  const [loadingInvite, setLoadingInvite] = React.useState<boolean>(false);

  const handleChangeInput = React.useCallback((e, setFunc) => {
    const v = e.target.value
    setFunc(v.replace(/[^0-9-]/ig,""))
  }, [])

  const whiteAddress = React.useMemo(() => {
    return process.env.GATSBY_RUN_ENV === "DEV" ? testWhiteAddress : prodWhiteAddress
  }, [])

  React.useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  const contract = React.useMemo(() => {
    if (!chainId || !library) return null
    return new MintContract(chainId, library)
  },[chainId, library])

  React.useEffect(() => {
    if (!contract || !account) return
    contract.getGivedLand(account).then((ret) => {
      setIsGived(ret.isGived)
    })
  }, [account, contract, loadingMint])

  React.useEffect(() => {
    if (!account) return
    setInWhiteList(!!whiteAddress[account.toLowerCase()])
  }, [account, whiteAddress])

  const canMint = React.useMemo(() => {
    console.log({isGived, inWhiteList})
    return !isGived && inWhiteList;
  }, [isGived, inWhiteList])

  React.useEffect(() => {
    if (!isGived || !account) return
    contract.getMintLandCount(account).then((v) => {
      setLandCount(v)
    })
  }, [isGived, account, contract, loadingInvite, loadingMint])

  const canInvite = React.useMemo(() => {
    return isGived && landCount < 2;
  }, [isGived, landCount])

  const mintText = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <></>
    }
    return <p className={styles.mintRemindTitle}>There is still time before the MINT starts...</p>
  }, [currentMoment])

  const handleMint = React.useCallback(() => {
    if (!contract) return
    setLoadingMint(true)
    contract.mintToSelf(mintX, mintY, whiteAddress[account.toLowerCase()]).then((tx) => {
      setMintX("")
      setMintY("")
      tx.wait().then().catch().finally(() => setLoadingMint(false))
    }).catch((e) => {
      console.log(e)
      setLoadingMint(false)
    })
  }, [contract, mintX, mintY, account, whiteAddress])

  const handleInvite = React.useCallback(() => {
    if (!contract) return
    setLoadingInvite(true)
    if (inviteSlogan !== "") {
      contract.mintAndGiveToWithSlogan(inviteX, inviteY, inviteAddress, inviteSlogan).then((tx) => {
        setInviteX("")
        setInviteY("")
        setInviteAddress("")
        setInviteSlogan("")
        tx.wait().then().catch().finally(() => setLoadingInvite(false))
      }).catch((e) => {
        console.log(e)
        setLoadingInvite(false)
      })
      return
    }
    contract.mintAndGiveTo(inviteX, inviteY, inviteAddress).then((tx) => {
      setInviteX("")
      setInviteY("")
      setInviteAddress("")
      tx.wait().then().catch().finally(() => setLoadingInvite(false))
    }).catch((e) => {
      console.log(e)
      setLoadingInvite(false)
    })
  }, [contract, inviteY, inviteX, inviteAddress, inviteSlogan])

  const mintDom = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <p className={styles.mintDesc}>
          Link your Metamask wallet. <br/>
          The system will recognize that you are an original donor.<br/>
          The "free mint" button will be activated, enter the x & y axis that you want to mint, check your gas fee and it's done!<br/>
          Note: Some coordinates have been minted, see here at <a href="https://opensea.io/collection/people-land" target="_blank" style={{color: "#625FF6"}}>Opensea</a>.
        </p>
        <div className={styles.inputs}>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canMint && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canMint && styles.inputDisabled}`}>📜X:</span>
                <input
                  disabled={!canMint}
                  className={styles.input + ` ${!canMint && styles.inputDisabled}`}
                  type="text"
                  value={mintX}
                  onChange={e => handleChangeInput(e, setMintX)}
                />
              </span>
          </div>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canMint && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canMint && styles.inputDisabled}`}>📜Y:</span>
                <input disabled={!canMint} className={styles.input + ` ${!canMint && styles.inputDisabled}`}
                       value={mintY}
                       onChange={e => handleChangeInput(e, setMintY)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canMint} onClick={handleMint} loading={loadingMint}>Free Mint</Button>
      </>
    }
    const diff = moment.duration(BeginMintDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")

    return <div className={styles.countDownContent}>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Days</div>
        <div className={styles.countDownText}>{diff.days()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Hours</div>
        <div className={styles.countDownText}>{diff.hours()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Minutes</div>
        <div className={styles.countDownText}>{diff.minutes()}</div>
      </div>
      <div className={styles.countDown}>
        <div className={styles.countDownTitle}>Seconds</div>
        <div className={styles.countDownText}>{diff.seconds()}</div>
      </div>
    </div>
  }, [currentMoment, canMint, handleChangeInput, mintX, mintY, handleMint, loadingMint])

  const inviteDom = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <div className={styles.mintText}>
          <div className={styles.mintLine} />
          <div className={styles.mintTitle}>INVITE</div>
          <div className={styles.mintLine} />
        </div>
        <p className={styles.inviteDesc}>
          You can only invite by owning PeopleLand. <br/>
          Invitation cost is 0.66 ETH to mint. Enter the x & y axis that you want to mint, provide a slogan, ETH address of the neighbor you are inviting, check your gas fee and it's done!<br/>
          Note: Once you have used both your invitations you will no longer be able to invite another PEOPLE to PeopleLand.
        </p>
        <div className={styles.inputs}>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜X:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteX}
                       onChange={e => handleChangeInput(e, setInviteX)}
                       type="text"/>
              </span>
          </div>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Y:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteY}
                       onChange={e => handleChangeInput(e, setInviteY)}
                       type="text"/>
              </span>
          </div>
        </div>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Give to address:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteAddress}
                       onChange={e => setInviteAddress(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Slogan:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={inviteSlogan}
                       onChange={e => setInviteSlogan(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canInvite} loading={loadingInvite} onClick={handleInvite}>Invite 0.66ETH</Button>
      </>
    }
    return <></>
  }, [currentMoment, canInvite, inviteX, inviteY, inviteAddress, inviteSlogan, handleInvite, loadingInvite, handleChangeInput])

  const sloganDom = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <div className={styles.mintText}>
          <div className={styles.mintLine} />
          <div className={styles.mintTitle}>SLOGAN</div>
          <div className={styles.mintLine} />
        </div>
        <div className={styles.sloganImg}>
          <img src={sloganDescImg} width="283px" height="134px" alt=""/>
        </div>
        <p className={styles.sloganDesc}>
          You may change your slogan whenever you like. <br/>
          What description would you like to provide for your slogan?
        </p>
        <div className={styles.inviteAddressInput}>
          <div className={styles.inviteAddressInputContent}>
              <span className={styles.inviteAddressInputWrapper + ` ${!canInvite && styles.inputDisabled}`}>
                <span className={styles.inputPrefix + ` ${!canInvite && styles.inputDisabled}`}>📜Slogan:</span>
                <input disabled={!canInvite} className={styles.input + ` ${!canInvite && styles.inputDisabled}`}
                       value={customSlogan}
                       onChange={e => setCustomSlogan(e.target.value)}
                       type="text"/>
              </span>
          </div>
        </div>
        <Button disabled={!canInvite} loading={loadingInvite} onClick={handleInvite}>Submit</Button>
      </>
    }
    return <></>
  }, [currentMoment, canInvite, customSlogan, loadingInvite, handleInvite])

  return useMemo(() => <Page title="" chainId={chainId} account={account} connectMetamask={connectMetamask}>
    <p className={styles.title}>PEOPLELAND</p>
    <p className={styles.scroll}>(📜,📜)</p>
    <p className={styles.desc}>For the PEOPLE of ConstitutionDAO who made history</p>
    <div className={styles.content}>
      <p className={styles.subtitle}>Rules</p>
      <p className={styles.subcontent}>
        Donors are free to mint a piece of land with no fee <br/>
        A person who has obtained 'land' is now PEOPLE<br/>
        A PEOPLE is allowed to invite at most two other persons<br/>
        To invite a person you can mint land and provide that to him/her<br/>
        The cost to mint for invitations is {BeginMintDatetime.isSameOrBefore(currentMoment) ? `0.66ETH(average donation amount)` : `？？？`}<br/>
        25 plots of land around the central 0 point, reserved by the builder<br/>
        mint for Invitation can only choose outside the red area
      </p>
      <div><img className={styles.landImg} src={Land} alt="land"/></div>
      <p className={styles.subcontent}>
        Only one person can be the owner of a piece of land<br/>
        Each person can only accept an invitation once
      </p>
      <p className={styles.subtitle}>Neighbors</p>
      <p className={styles.subcontent}>
        PEOPLELAND saves invitations and neighbor's relationships forever.<br/>
        Getting an invitation is an honor and the value of land is determined by neighoring land, be careful to invite neighbors!
      </p>
      <p className={styles.subtitle}>Explaination</p>
      <p className={styles.subcontent}>
        Land is a space with (x,y) coordinates. The positive x is east and the negative is west, the positive y is north and the negative is south. Each value of x and y can only be a numerical whole number, there is no limit to the maximum possible range and every coordinate position represents an area of 100 x 100 square meters.
      </p>
      <p className={styles.subtitle}>What can we do?</p>
      <p className={styles.subcontent}>Feel free to use PEOPLELAND in any way you want.</p>
      <p className={styles.subtitle}>Update Image</p>
      <p className={styles.subcontent}>Click the refresh button on your PEOPLELAND when on OpenSea to view the changes in your neighborhood!</p>
      <div><img className={styles.guideImg} src={Guide} alt="guide opensea"/></div>
    </div>
    <div className={styles.mintText}>
      <div className={styles.mintLine} />
      <div className={styles.mintTitle}>MINT</div>
      <div className={styles.mintLine} />
    </div>
    {mintText}
    {mintDom}
    {inviteDom}
    {/*{sloganDom}*/}
    <p className={styles.end}>
      Available via contract only. Not audited. Mint at your own risk. <br/>
      For any questions about invitations join the discord server, or <a href="https://etherscan.io/address/0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b" target="_blank" style={{color: "#625FF6"}}>view the contract</a>
    </p>
  </Page>, [account, chainId, connectMetamask, currentMoment, inviteDom, mintDom, mintText])
}

export default IndexPage
