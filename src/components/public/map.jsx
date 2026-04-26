import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
