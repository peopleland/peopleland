import "./src/styles/global.css"
import wrapWithProvider from "./src/state/wrap"
import { Buffer } from "buffer"

window.Buffer = window.Buffer || Buffer
export const wrapRootElement = wrapWithProvider
