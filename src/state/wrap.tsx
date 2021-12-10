import React from "react"
import { Web3ReactProvider } from '@web3-react/core'
import {ethers} from "ethers";

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider)// this will vary according to whether you use e.g. ethers or web3.js
}

export default ({ element }) => {
  return <Web3ReactProvider getLibrary={getLibrary}>
    {element}
  </Web3ReactProvider>
}
