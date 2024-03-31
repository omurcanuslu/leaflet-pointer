import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer } from "@fortawesome/free-regular-svg-icons";
import {
  faTrash,
  faMapPin,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { MapProps } from "./Map";

// <---------- Data Formatı interface'i ---------------->
export interface LocationData {
  _id: string;
  lat: string;
  lng: string;
  datetime: string;
}
// <----------/  ----->

// <---------- Deploy edilmiş apinin url'i ---------------->
export const leafletDB = "https://sore-lime-squirrel-kilt.cyclic.app";
// <----------/  ----->

function ControlBar({ setTargetCoordinate, currentCoordinate }: MapProps) {
  const [dummyData, setDummyData] = useState<LocationData[]>([]);

  // <---------- Sayfa açıldığında koordinatları çeksin ---------------->
  useEffect(() => {
    getData();
  }, []);
  // <----------/  ----->

  // <---------- Point değiştirme fonksiyonu ---------------->
  const handleTargetCoordinate = (lat: number, lng: number) => {
    if (setTargetCoordinate) {
      setTargetCoordinate([lat, lng]);
      localStorage.setItem("lastPoint", JSON.stringify([lat, lng]));
    }
  };
  // <----------/  ----->

  // <---------- tüm koordinatları state'e yazma fpnksiyonu ---------------->
  async function getData() {
    try {
      const response = await axios.get(`${leafletDB}/coordinates`);
      setDummyData(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  // <----------/  ----->

  // <----------  koordinat Silme fonksiyonu---------------->
  async function handleDelete(id: String) {
    try {
      await axios.delete(`${leafletDB}/coordinates/${id}`);
      getData();
    } catch (error) {
      console.error(error);
    }
  }
  // <----------/  ----->

  // <----------  koordinat ekleme fonksiyonu---------------->
  const handleAddCoordinate = async () => {
    try {
      if (currentCoordinate !== undefined && currentCoordinate !== null) {
        const coordinate = {
          lat: currentCoordinate[0],
          lng: currentCoordinate[1],
          datetime: currentCoordinate[2],
        };
        await axios.post(`${leafletDB}/coordinates`, coordinate);
        getData();
        if (setTargetCoordinate) {
          setTargetCoordinate([currentCoordinate[0], currentCoordinate[1]]);
          localStorage.setItem("lastPoint", JSON.stringify([currentCoordinate[0], currentCoordinate[1]]));
        }
      }
    } catch (error) {
      console.log(error);
      alert("Koordinat eklenirken bir hata oluştu!");
    }
  };
  // <----------/  ----->

  // <----------  koordinatları Json formatında indirme fonksiyonu (https://theroadtoenterprise.com/blog/how-to-download-csv-and-json-files-in-react) bağlantısından uyarlandı---------------->
  const downloadJson = (filename: string, jsonContent: any) => {
    const data = JSON.stringify(jsonContent);
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownload = () => {
    downloadJson("Points.json", dummyData);
  };
  // <----------/  ----->

  return (
    <div className="fixed z-[999999] bottom-0 right-0 md:bottom-1/4 md:right-1 w-screen !important md:w-1/5 ">
      <div
        onClick={handleAddCoordinate}
        className="m-3 p-1 md:p-2 border-2 border-solid  border-red-100 bg-amber-300 rounded-xl flex justify-center"
      >
        <button>
          <div>
            <FontAwesomeIcon
              className="text-black text-md md:text-lg hover:text-red-600"
              icon={faMapPin}
            />
          </div>
          <div>Koordinat Ekle</div>
        </button>
      </div>
      <div className="m-3 p-0 md:p-1 border-2 border-solid  border-red-100 bg-amber-300 rounded-xl flex justify-center">
       {dummyData.length} Kayıt
      </div>
      <div className="md:max-h-[28rem] overflow-y-auto overflow-x-auto hide-scrollbar">
        <ul className="text-xs md:text-lg flex md:flex-col md:p-2">
          {dummyData
            .sort(
              (a, b) =>
                new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
            )
            .map((item, index) => (
              <li
                className="m-4 p-1 md:p-2 border-2 border-solid rounded-lg border-red-100 bg-slate-100"
                key={index}
              >
                
                <div className="flex flex-3">
                  <div className="flex-2 ">
                    
                  <p>Lat:</p>
                  <p>Lng:</p>
                  <p >Date:</p>
                  <p>Time:</p>
                  </div>
                  <div  className="flex-1 text-end text-[10px] md:text-lg ">
                    
                  <p>{parseFloat(item.lat).toFixed(4)} </p>
                  <p>{parseFloat(item.lng).toFixed(4)}</p>
                  {/* gün.ay.yıl dönüştürme */}
                  <p className="">{item.datetime.split('T')[0].split("-")[2]}.{item.datetime.split('T')[0].split("-")[1]}.{item.datetime.split('T')[0].split("-")[0]}</p>
                  <p>{item.datetime.split('T')[1].split(".")[0]}</p>
                  </div>
                 
                </div>
                <div className="flex justify-around md:p-2">
                  <button
                    onClick={() =>
                      handleTargetCoordinate(
                        parseFloat(item.lat),
                        parseFloat(item.lng)
                      )
                    }
                    className="p-1 md:p-2 bg-amber-300 rounded-xl"
                  >
                    <FontAwesomeIcon
                      className="text-black text-md md:text-lg hover:text-purple-700"
                      icon={faHandPointer}
                    />
                  </button>
                  <button className="p-1 md:p-2 bg-amber-300 rounded-xl">
                    <FontAwesomeIcon
                      onClick={() => handleDelete(item._id)}
                      className="text-black text-md md:text-lg hover:text-red-600"
                      icon={faTrash}
                    />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      { dummyData.length > 0 &&(
          <div
          onClick={handleDownload}
          className="m-4 p-1 md:p-2 border-2 border-solid  border-red-100 bg-amber-300 rounded-xl flex justify-center"
          >
          <button>
            <div>
              <FontAwesomeIcon
                className="text-black text-md md:text-lg hover:text-blue-400"
                icon={faDownload}
              />
            </div>
          </button>
          </div>
      )}
      
    </div>
  );
}

export default ControlBar;
