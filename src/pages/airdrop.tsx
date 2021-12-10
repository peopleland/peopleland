import * as React from "react"
import * as styles from "./airdrop.module.css"
import Page from "../components/page";
import moment from "moment";
import {
  BeginAirdropDatetime,
} from "../utils/global";
import detectEthereumProvider from "@metamask/detect-provider";

const AirdropPage = () => {
  // const { library, account, chainId, active, activate } = useWeb3React();
  const [currentMoment, setCurrentMoment] = React.useState(moment());
  // const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  // const [isClaimed, setIsClaimed] = React.useState<boolean>(false);
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

  React.useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  const diffDatetime = React.useMemo(() => {
    return moment.duration(BeginAirdropDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")
  }, [currentMoment])

  const countDown = React.useMemo(() => {
    return <>
      <p className={styles.title}>There is still time before the AIRDROP starts...</p>
      <div className={styles.countDownContent}>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Days</div>
          <div className={styles.countDownText}>{diffDatetime.days()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Hours</div>
          <div className={styles.countDownText}>{diffDatetime.hours()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Minutes</div>
          <div className={styles.countDownText}>{diffDatetime.minutes()}</div>
        </div>
        <div className={styles.countDown}>
          <div className={styles.countDownTitle}>Seconds</div>
          <div className={styles.countDownText}>{diffDatetime.seconds()}</div>
        </div>
      </div>
    </>
  }, [diffDatetime])


  return React.useMemo(() => <Page chainId={chainId} account={account} connectMetamask={connectMetamask} title={"Airdrop"}>
    <div className={styles.airdrop}>
      {countDown}
      <p className={styles.end}>
        Available via contract only. Not audited. Mint at your own risk. <br/>
        For rules on airdrops, please learn through <a href="https://github.com/peopleland/discussion/discussions/16" target="_blank" style={{color: "#625FF6"}}>proposal</a> or view the <a href="https://ropsten.etherscan.io/address/0xD1d30B80C5EFB9145782634fe0F9cbeD5D24ef3b" target="_blank" style={{color: "#625FF6"}}>contract</a>.
      </p>
    </div>
  </Page>, [account, chainId, connectMetamask, countDown])
}

export default AirdropPage;
