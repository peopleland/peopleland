import * as React from "react"
import Header from "../components/header"
import * as styles from "./index.module.css"
import Guide from "../assets/guide.jpeg"
import Land from "../assets/land.png"
import detectEthereumProvider from "@metamask/detect-provider";
import {Contract} from "../app/contract";
import prodWhiteAddress from "../assets/prod_address_sign_info.json";
import testWhiteAddress from "../assets/test_address_sign_info.json";
import moment from "moment";
import {BeginMintDatetime} from "../utils/global";

const loadingDom = <span className={styles.loadingIcon}>
  <span role="img" aria-label="loading" className={styles.iconLoading}>
    <svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>
  </span>
</span>

const IndexPage = () => {
  const [metamaskProvider, setMetamaskProvider] = React.useState(null);
  const [network, setNetwork] = React.useState<string>(null);
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const [isGived, setIsGived] = React.useState<boolean>(false);
  const [landCount, setLandCount] = React.useState<number>(0);
  const [currentMoment, setCurrentMoment] = React.useState(moment());
  const [inWhiteList, setInWhiteList] = React.useState(false);

  const [invitePrice, setInvitePrice] = React.useState();

  const [mintX, setMintX] = React.useState("");
  const [mintY, setMintY] = React.useState("");
  const [inviteX, setInviteX] = React.useState("");
  const [inviteY, setInviteY] = React.useState("");
  const [inviteAddress, setInviteAddress] = React.useState("");
  const [inviteSlogan, setInviteSlogan] = React.useState("");

  const [loadingMint, setLoadingMint] = React.useState<boolean>(false);
  const [loadingInvite, setLoadingInvite] = React.useState<boolean>(false);

  const handleChangeInput = React.useCallback((e, setFunc) => {
    const v = e.target.value
    setFunc(v.replace(/[^0-9-]/ig,""))
  }, [])

  const whiteAddress = React.useMemo(() => {
    return process.env["GATSBY_RUN_ENV"] === "DEV" ? testWhiteAddress : prodWhiteAddress
  }, [])

  React.useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  React.useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true, timeout: 5000 }).then((v: any) => {
      if (!v) return
      setMetamaskProvider(v)
    })
  }, [])

  const contract = React.useMemo(() => {
    if (!network || !metamaskProvider) return null
    return new Contract(network, metamaskProvider)
  },[network, metamaskProvider])

  React.useEffect(() => {
    if (metamaskProvider) {
      metamaskProvider.on('accountsChanged', (acs: string[]) => {
        setAccounts(acs);
      });
      metamaskProvider.on('chainChanged', (cid: string) => {
        setNetwork(cid);
      });
    }
  }, [metamaskProvider])

  const connectMetamask = React.useCallback(() => {
    if (!metamaskProvider) {
      window.location.href = 'https://metamask.io/'
      return
    }
    metamaskProvider.request({ method: 'eth_chainId' }).then((chainId: any) => {
      setNetwork(chainId)
    })
    metamaskProvider.request({ method: 'eth_requestAccounts' }).then((accs: any) => {
      setAccounts(accs)
    })
  }, [metamaskProvider])

  const account = React.useMemo(() => {
    if (accounts && accounts.length > 0) return accounts[0].toLowerCase()
    return null
  }, [accounts])

  React.useEffect(() => {
    if (!contract || !account) return
    contract.getGivedLand(account).then((ret) => {
      setIsGived(ret.isGived)
    })
  }, [account, loadingMint])

  React.useEffect(() => {
    if (!account) return
    setInWhiteList(!!whiteAddress[account])
  }, [account])

  const canMint = React.useMemo(() => {
    return !isGived && inWhiteList;
  }, [isGived, inWhiteList])

  React.useEffect(() => {
    if (!isGived || !accounts || accounts.length < 1) return
    contract.getMintLandCount(accounts[0]).then((v) => {
      setLandCount(v)
    })
  }, [isGived, accounts, contract, loadingInvite, loadingMint])

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
    contract.mintToSelf(mintX, mintY, whiteAddress[account]).then((tx) => {
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
        <div className={styles.button}>
          <a className={`${!canMint && styles.buttonDisabled}`} onClick={handleMint}>
            <div className={`${!canMint && styles.buttonDisabled}` + ` ${loadingMint && styles.buttonLoading}`}>{loadingMint && loadingDom}Free Mint</div>
          </a>
        </div>
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
        <div className={styles.button}>
          <a className={`${!canInvite && styles.buttonDisabled}`} onClick={handleInvite}>
            <div className={`${!canInvite && styles.buttonDisabled} ${loadingInvite && styles.buttonLoading}`}>{loadingInvite && loadingDom}Invite 0.66ETH</div>
          </a>
        </div>
      </>
    }
    return <></>
  }, [currentMoment, canInvite, inviteX, inviteY, inviteAddress, inviteSlogan, handleInvite, loadingInvite])

  return (
    <>
      <title>People Land</title>
      <div>
        <Header connectWallet={connectMetamask} accounts={accounts} network={network}/>
        <main>
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
          <p className={styles.end}>
            Available via contract only. Not audited. Mint at your own risk. <br/>
            For any questions about invitations join the discord server, or <a href="https://etherscan.io/address/0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b" target="_blank" style={{color: "#625FF6"}}>view the contract</a>
          </p>
          <p className={styles.tips}>
            This page is open source in <a href="https://github.com/icpdao/peopleland" target="_blank" style={{color: "#625FF6"}}>GitHub</a>. You can modify and deploy it at will.
          </p>
        </main>
      </div>
    </>
  )
}

export default IndexPage
