import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaLocal({
  altura = "400px",
  zoom = 16,
}) {
  const posicion = [42.54615, -6.58879];

  return (
    <MapContainer
      center={posicion}
      zoom={zoom}
      style={{ height: altura, width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={posicion}>
        <Popup>
          La Nonnesa Pizza Party<br />
          Calle Obispo Osmundo, 3
        </Popup>
      </Marker>
    </MapContainer>
  );
}
