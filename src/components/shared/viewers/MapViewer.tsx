import "../../../styles/shared/viewers/MapViwer.css";

export default function MapViewer(props: any) {
  const apiKey = "AIzaSyCqbN5FMGKUGR9MUiWgIaLNUwT0VxNswV0";

  return (
    <div>
      {props.lat && props.lat !== "" && (
        <iframe
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${props.lat},${props.lng}`}
        ></iframe>
      )}

      {(!props.lat || props.lat === "") && (
        <div className="no-map-view">
          <img src="/images/common/map.png" alt="" />
        </div>
      )}
    </div>
  );
}
