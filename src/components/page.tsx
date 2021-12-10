import * as styles from "./page.module.css";
import {Link} from "gatsby";
import {EthereumNetwork} from "../utils/global";
import {useMemo} from "react";
import React from "react";
// import detectEthereumProvider from "@metamask/detect-provider";
// import { useWeb3React } from "@web3-react/core"
// import {Injected} from "../hooks/useWallet";


const Page = ({title, account, chainId, connectMetamask, children}) => {

  // const { active, activate, deactivate, account, chainId } = useWeb3React()

  // const connectMetamask = useCallback(async () => {
  //   try {
  //     if (!active) await activate(Injected)
  //     else await deactivate()
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }, [activate, active, deactivate])


  const rightHeader = useMemo(() => {
    if (account && chainId) {
      let networkDom
      if (chainId !== 1) networkDom = <div className={styles.testNetwork}>[{EthereumNetwork[chainId]}]&nbsp;</div>
      return <div className={styles.connect} onClick={connectMetamask}>
        <div className={styles.connectText}>
          {!!networkDom && networkDom}
          {account?.substr(0, 6)}...{account?.substr(-4)}
        </div>
      </div>
    }
    return <div className={styles.connect} onClick={connectMetamask}>
      <div className={styles.connectText}>Connect Wallet</div>
    </div>
  }, [account, chainId, connectMetamask])

  return useMemo(() => (
    <>
      <title>People Land {!!title && `- ${title}`}</title>
      <div className={styles.pageWrapper}>
        <div className={styles.page}>
          <header>
            <div className={styles.links}>
              <div><Link to="/">Home</Link></div>
              <div><Link to="/airdrop">Airdrop</Link></div>
              <div><a href="https://opensea.io/collection/people-land" target="_blank">Opensea</a></div>
              <div><a href="https://discord.gg/KNUBFsxxS3" target="_blank">Discord</a></div>
              {/*<div><a href="https://discord.gg/KNUBFsxxS3" target="_blank">Mission</a></div>*/}
              <div><a href="https://app.icpdao.co" target="_blank">DAO</a></div>
            </div>
            {rightHeader}
          </header>
          <main>
            {children}
          </main>
          <footer>
            <p className={styles.tips}>
              This page is open source in <a href="https://github.com/peopleland/peopleland" target="_blank" style={{color: "#625FF6"}}>GitHub</a>. You can modify and deploy it at will.
            </p>
          </footer>
        </div>
      </div>
    </>
  ), [children, rightHeader, title])
}

export default Page
