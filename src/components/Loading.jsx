import LoadingStyles from "../css-modules/Loading.module.css";

export default function Loading() {
  return (
    <div className={LoadingStyles["loading"]}>
      <img src="./loading-icon.svg" />
    </div>
  );
}
