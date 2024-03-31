'use client';
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import ControlBar from "./ControlBar";

// <---------- Props type interface'i ---------------->
export interface MapProps {
  setCurrentCoordinate: Dispatch<SetStateAction<[number, number, string] | null>>;
  currentCoordinate?: [number, number, string] | null;
  setTargetCoordinate?: Dispatch<SetStateAction<[number, number]>>;
  targetCoordinate?: Dispatch<SetStateAction<[number, number]>>;

}
// <----------/  ----->

// <---------- Harita hareket ettikçe CurrentCoordinate'e set ediyor  ---------------->
function MyComponent({ setCurrentCoordinate }: MapProps) {
  const map = useMapEvents({
    move: () => {
      onMove();
    },
  });
  
  // içinde fonksiyon döndürdüğü useCallback kullanıldı, veri dönseydi useMemo kullanılabilirdi.
  const onMove = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        const date = new Date();
        setCurrentCoordinate([center.lat, center.lng, date.toISOString()]);
      }
    }
  }, [map]);
  // <----------/  ----->

  return null;
}
// <---------- Sayfa açıldığında ve 'targetCoordinate' değiştiğinde useMemo tetiklenip haritayı güncelliyor ---------------->
const Map = () => {
  const [currentCoordinate, setCurrentCoordinate] = useState<[number, number, string] | null>(null);
  const [targetCoordinate, setTargetCoordinate] = useState<[number, number]>([40.79498546816049, 29.40166870117188]);

  const mainMap = useMemo(
    () => (
      <MapContainer
        className="w-screen h-screen"
        zoom={6}
        center={targetCoordinate}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={targetCoordinate}>
          <MyComponent setCurrentCoordinate={setCurrentCoordinate} />
        </Marker>
      </MapContainer>
    ),
    [targetCoordinate]
  );
    // <----------/  ----->
 

  return (
    <div>
      {mainMap}

      <ControlBar
        setCurrentCoordinate={setCurrentCoordinate}
        currentCoordinate={currentCoordinate}
        setTargetCoordinate={setTargetCoordinate}
      />
    </div>
  );
};
export default Map;
