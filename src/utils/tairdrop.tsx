import * as React from "react"
import * as styles from "../pages/airdrop.module.css"
import Page from "../components/page";
import moment from "moment";
import {
  AirdropList,
  AvailableNetwork,
  BeginAirdropDatetime,
  EndAirdropDatetime
} from "./global";
import SwitchNetwork from "../assets/switch_network.png"
import Button from "../components/button";
import {useWeb3React} from "@web3-react/core";
import {Injected} from "../hooks/useWallet";
import {AirdropContract} from "../app/airdropContract";
import numeral from "numeral";

const AirdropPage = () => {
  const { library, account, chainId, active, activate } = useWeb3React();
  const [currentMoment, setCurrentMoment] = React.useState(moment());
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const [isClaimed, setIsClaimed] = React.useState<boolean>(false);

  React.useEffect(() => {
    setInterval(() => {
      setCurrentMoment(moment())
    }, 1000)
  }, [])

  React.useEffect(() => {
    if (active && chainId !== AvailableNetwork) {
      Injected.getProvider().then((provider) => {
        provider.send({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${AvailableNetwork.toString(16)}` }],
        }, () => {setButtonLoading(false)})
      })
    }
  }, [active, chainId])

  const airdropData = React.useMemo(() => {
    if (!active) return
    return AirdropList[account.toLowerCase()]
  }, [account, active])

  const contract = React.useMemo(() => {
    if (!chainId || !library) return null
    return new AirdropContract(contract, library)
  }, [chainId, library])

  React.useEffect(() => {
    if (!active || !contract || !airdropData) return
    contract.getIsClaimed(airdropData.tol, account).then((v) => {
      console.log(v)
      setIsClaimed(v.isCliaimed)
    })
  }, [account, active, airdropData, contract])

  const claimDisabled = React.useMemo(() => {
    if (!active || !contract || !airdropData) return true
    if (isClaimed) return true
    if (!!airdropData.tol && airdropData.tol > 0) return false
    return true
  }, [active, airdropData, contract, isClaimed])

  const diffDatetime = React.useMemo(() => {
    return moment.duration(BeginAirdropDatetime.diff(currentMoment, 'seconds'), 'seconds').locale("en")
  }, [currentMoment])

  const switchNetworkTips = React.useMemo(() => {
    return <div className={styles.tips}>
      <div className={styles.switchNetworkTips}>
        <div className={styles.switchTitle}>Please change your network to Ethereum Mainnet</div>
        <img src={SwitchNetwork} alt="switch network" width="100%" />
      </div>
    </div>
  }, [])

  const handlerClaim = React.useCallback(async () => {
    if (!airdropData || chainId !== AvailableNetwork || !contract) return
    setButtonLoading(true)
    contract.claimTokens(airdropData.tol, account).then(() => {
      setButtonLoading(false)
    }).catch(() => setButtonLoading(false))
  }, [account, airdropData, chainId, contract])

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

  const claimButton = React.useMemo(() => {
    if (!active || chainId !== AvailableNetwork) {
      return <Button block={true} size={'large'} disabled={false} loading={buttonLoading} onClick={async () => {
        try {
          await activate(Injected)
        } catch (e) {
          console.log(e)
        }
      }}><span style={{color: "#fff"}}>
      Connect Wallet</span>
      </Button>
    }
    if (isClaimed) {
      return <Button block={true} size={'large'} disabled={true} loading={buttonLoading} onClick={() => {}}>
        <span style={{color: "#fff"}}>Tokens Claimed Successfully</span>
      </Button>
    }
    return <Button block={true} size={'large'} disabled={claimDisabled} loading={buttonLoading} onClick={handlerClaim}>
      <span style={{color: "#fff"}}>One-Click Claim</span>
    </Button>
  }, [activate, active, buttonLoading, chainId, claimDisabled, handlerClaim, isClaimed])

  const claimTitle = React.useMemo(() => {
    if (!active || chainId !== AvailableNetwork) return ["Claim your tokens", "Please make sure to connect your wallet using Metamask and switch to the Ethereum Mainnet."]
    if (!airdropData) return ["Unfortunately, no token to claim", "This Ethereum account is not eligible for the airdrop. please make sure you are connected with the right account."]
    if (!isClaimed) return ["Congratulation, you can claim it", "You are eligible for the airdrop! View your tokens below, and one-click claim it."]
    if (isClaimed) return ["Your tokens are claimed!", "You were eligible for the retroactive airdrop, and you successfully claimed your tokens."]
  }, [active, airdropData, chainId, isClaimed])

  const airdropValueList = React.useMemo(() => {
    if (!airdropData) return
    return [
      airdropData.init > 0 ? numeral(airdropData.init).format('0,0') : 0,
      airdropData.hC > 0 ? <span>{numeral(airdropData.hA).format('0,0')} &times; {airdropData.hC}</span> : 0,
      airdropData.inviC > 0 ? <span>{numeral(airdropData.inviA).format('0,0')} &times; {airdropData.inviC}</span> : 0,
      airdropData.neiC > 0 ? <span>{numeral(airdropData.neiA).format('0,0')} &times; {airdropData.neiC}</span> : 0,
    ]
  }, [airdropData])

  const airdropShow = React.useMemo(() => {
    return <div className={styles.content}>
      <div className={styles.rewardsList}>
        <div className={styles.rewardsValue}>
          <div>Rewards</div>
          <div style={{fontWeight: 700}}>
            <div>Initial Team</div>
            <div>{!!airdropValueList && airdropValueList[0]}</div>
          </div>
          <div style={{fontWeight: 700}}>
            <div>Hold</div>
            <div>{!!airdropValueList && airdropValueList[1]}</div>
          </div>
          <div style={{fontWeight: 700}}>
            <div>Invite</div>
            <div>{!!airdropValueList && airdropValueList[2]}</div>
          </div>
          <div style={{fontWeight: 700}}>
            <div>Neighbors</div>
            <div>{!!airdropValueList && airdropValueList[3]}</div>
          </div>
        </div>
        <div className={styles.rewardsTime}>
          <div>End time</div>
          <div>{EndAirdropDatetime.locale('en').format("LL")}</div>
        </div>
      </div>
      <div className={styles.rewardsAction}>
        <div className={styles.claimCard}>
          <div className={styles.claim}>
            <div className={styles.claimTitle}>{claimTitle[0]}</div>
            <div className={styles.claimDesc}>{claimTitle[1]}</div>
            <div className={styles.claimFrame}>
              <div className={styles.claimValue}>{!isClaimed ? "You will receive..." : "You received..."}</div>
              {!!airdropData && <div className={styles.claimNum}>{numeral(airdropData.tol).format('0,0')} BUILDER</div>}
            </div>
            {claimButton}
          </div>
        </div>
      </div>
    </div>
  }, [airdropData, airdropValueList, claimButton, claimTitle, isClaimed])

  const main = React.useMemo(() => {
    if (BeginAirdropDatetime.isSameOrBefore(currentMoment)) {
      return airdropShow
    }
    return countDown
  }, [airdropShow, countDown, currentMoment])

  return React.useMemo(() => <Page connectMetamask={() => {}} chainId={1} account={""} title={"Airdrop"}>
    {active && chainId !== AvailableNetwork && switchNetworkTips}
    <div className={styles.airdrop}>
      {main}
      <p className={styles.end}>
        Available via contract only. Not audited. Mint at your own risk. <br/>
        For rules on airdrops, please learn through proposal or view the contract.
      </p>
    </div>
  </Page>, [active, chainId, main, switchNetworkTips])
}

export default AirdropPage;
