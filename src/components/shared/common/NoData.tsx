import "../../../styles/shared/common/NoData.css";

export default function NoData(props: any) {
  return (
    <div className="No-Data py-5">
      <div className="mt-3"></div>
      <img src="/images/common/query.png" alt="" />
      <p>{props.message}</p>
    </div>
  );
}
