"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import React from "react";
import Menu from "../components/menu/menu";
import InfoGraficos from "@/components/infoGraficos/infoGraficos";

const MapaDeServicios = dynamic(
  () => import("../components/mapaDeServicios/mapaDeServicios"),
  { ssr: false }
);

import data from "./datosTest.json";

export default function Home() {
  //console.log(data);

  const [ciudades, setCiudades] = useState([]);
  const [servicios, setServicios] = useState([]);



  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      setCiudades(preCiudades => [...preCiudades, data[i]["CIUDAD"]])
      setServicios(servicios => [...servicios, {
      "CIUDAD" : data[i]["CIUDAD"],
      "CAMAS HOSPITALARIAS" : data[i]["CAMAS HOSPITALARIAS"],
      "CHILEXPRESS": data[i]["CHILEXPRESS"],
      "INDAP": data[i]["INDAP"],
      "SAG": data[i]["SAG"],
      "CAPREDENA": data[i]["CAPREDENA"]}]);
    }
  }, []);

  return (
    <>
      <div className="d-flex">
        <Menu data={data}/>
        <MapaDeServicios />
      </div>
      <InfoGraficos ciudades={ciudades} servicios={servicios}/>
    </>
  );
}
