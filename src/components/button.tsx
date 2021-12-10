import * as styles from "./button.module.css";
import * as React from "react";

export const LoadingDom = <span className={styles.loadingIcon}>
  <span role="img" aria-label="loading" className={styles.iconLoading}>
    <svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"/></svg>
  </span>
</span>

type ButtonProps = {
  loading: boolean;
  size?: "large" | "small";
  block?: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({loading, disabled, size, block, onClick, children}) => {
  const aClass = React.useMemo(() => {
    const l = []
    if (disabled) l.push(styles.buttonDisabled)
    if (block) l.push(styles.buttonBlock)
    if (size === "large") l.push(styles.buttonLarge)
    return l.join(" ")
  }, [block, disabled, size])
  const divClass = React.useMemo(() => {
    const l = []
    if (disabled) l.push(styles.buttonDisabled)
    if (loading) l.push(styles.buttonLoading)
    if (size === "large") l.push(styles.buttonLargeText)
    return l.join(" ")
  }, [disabled, loading, size])
  return React.useMemo(() => (
    <div className={styles.button}>
      <a className={aClass} onClick={onClick}>
        <div className={divClass}>{loading && LoadingDom}{children}</div>
      </a>
    </div>
  ), [aClass, children, divClass, loading, onClick])
}

export default Button;
