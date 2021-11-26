import * as React from "react"
import Header from "../components/header"
import * as styles from "./index.module.css"
import Guide from "../assets/guide.png"
import Land from "../assets/land.jpeg"
import detectEthereumProvider from "@metamask/detect-provider";
// import {Contract} from "../app/contract";
import prodWhiteAddress from "../assets/prod_address_sign_info.json";
import moment from "moment";
import {BeginMintDatetime} from "../utils/global";

// markup
const IndexPage = () => {
  const [metamaskProvider, setMetamaskProvider] = React.useState(null);
  const [network, setNetwork] = React.useState<string>(null);
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const [isGived, setIsGived] = React.useState<boolean>(false);
  const [currentMoment, setCurrentMoment] = React.useState(moment());
  const [inWhiteList, setInWhiteList] = React.useState(false);

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

  // const contract = React.useMemo(() => {
  //   if (!network || !metamaskProvider) return null
  //   return new Contract(network, metamaskProvider)
  // },[network, metamaskProvider])

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

  // React.useEffect(() => {
  //   if (!accounts || accounts.length < 1 || !contract) return
  //   const account = accounts[0]
  //   contract.getGivedLand(account).then((ret) => {
  //     setIsGived(ret)
  //     if (!ret) {
  //
  //     }
  //   })
  // }, [accounts])

  console.log(network, accounts)

  React.useEffect(() => {
    if (!accounts || accounts.length < 1) return
    const account = accounts[0]
    setInWhiteList(!!prodWhiteAddress[account])
  }, [accounts])

  const mintText = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <></>
    }
    return <p className={styles.mintRemindTitle}>There is still time before the MINT starts...</p>
  }, [currentMoment])

  const mintDom = React.useMemo(() => {
    if (BeginMintDatetime.isSameOrBefore(currentMoment)) {
      return <>
        <div className={styles.inputs}>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>📜X:</span>
                <input className={styles.input} type="text"/>
              </span>
          </div>
          <div className={styles.inputContent}>
              <span className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>📜Y:</span>
                <input className={styles.input} type="text"/>
              </span>
          </div>
        </div>
        <div className={styles.button}>
          <a><div>Mint</div></a>
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
  }, [currentMoment])

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
              The cost to mint for invitations is ？？？<br/>
              mint for Invitation can only choose outside the green area
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
          <p className={styles.end}>
            Available via contract only. Not audited. Mint at your own risk. <br/>
            For any questions about invitations join the discord server, or <a href="" style={{color: "#625FF6"}}>view the contract</a>
          </p>
        </main>
      </div>
    </>
  )
}

export default IndexPage