import * as React from "react";
import * as styles from "./header.module.css"
import {EthereumNetwork} from "../utils/global";

export default ({connectWallet, accounts, network}) => {
  const rightHeader = React.useMemo(() => {
    if (accounts && network) {
      const account = accounts[0]
      let networkDom
      if (network !== "0x1") networkDom = <div className={styles.testNetwork}>[{EthereumNetwork[network]}]&nbsp;</div>
      return <div className={styles.connect}>
        <div className={styles.connectText}>
          {!!networkDom && networkDom}
          {account?.substr(0, 6)}...{account?.substr(-4)}
        </div>
      </div>
    }
    return <div className={styles.connect} onClick={connectWallet}>
      <div className={styles.connectText}>Connect Wallet</div>
    </div>
  }, [accounts, network, connectWallet])
  return <header>
    <div className={styles.links}>
      <div><a href="">Opensea</a></div>
      <div className={styles.linkDiscord}><a href="https://discord.gg/KNUBFsxxS3" target="_blank">Discord</a></div>
    </div>
    {rightHeader}
  </header>
}
