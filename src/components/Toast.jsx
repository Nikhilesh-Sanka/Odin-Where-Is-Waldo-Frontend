import Loading from "./Loading.jsx";
import ToastStyles from "../css-modules/Toast.module.css";
import { useRef, useEffect } from "react";

export default function Toast(props) {
  const toast = useRef(null);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      props.setTargetHitStatus(null);
    }, 1500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [props.targetHitStatus]);
  return (
    <div
      className={`${ToastStyles["toast"]} ${
        props.targetHitStatus === "it's a hit"
          ? ToastStyles["hit"]
          : props.targetHitStatus === "getting-result"
          ? ToastStyles["loading"]
          : ToastStyles["miss"]
      }`}
      ref={toast}
    >
      {props.targetHitStatus === "getting-result" ? (
        <Loading />
      ) : (
        props.targetHitStatus
      )}
    </div>
  );
}
