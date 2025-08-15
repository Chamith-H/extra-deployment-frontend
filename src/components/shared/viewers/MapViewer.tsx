export default function MapViewer(props: any) {
  const apiKey = "AIzaSyCqbN5FMGKUGR9MUiWgIaLNUwT0VxNswV0";

  return (
    <div>
      <iframe
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${props.lat},${props.lng}`}
      ></iframe>
    </div>
  );
}
