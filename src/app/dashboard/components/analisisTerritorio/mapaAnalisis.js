import React , { useRef }  from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  ScaleControl,
  MapControl,
  Marker,
  Popup,
  GeoJSON,
  useMap,
  CircleMarker,
  DivIcon,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapa.css";
//import "./mapaDeServicios.css";
//import geoJsonData from "../../datosDePrueba/Mancha_Urbana_2017.json";
import geoJsonData from "../../../../datosDePrueba/Mancha_Urbana_2017.json";
import html2canvas from "html2canvas";

//-39.821148, -73.237661
//const position = [-39.821148, -73.237661];

const WindroseControl = () => {
  return (
    <div className="windrose-control">
      {/* Aquí puedes agregar tu imagen de rosa de los vientos */}
      <img src="norte.png" alt="Windrose" />
    </div>
  );
};

function UpdateMapCentre(props) {
  const map = useMap();
  map.panTo(props.mapCentre);
  return null;
}

function calcularCentroPoligono(geoJSON) {
  if (geoJSON && geoJSON.geometry && geoJSON.geometry.type === "Polygon") {
    const coordinates = geoJSON.geometry.coordinates[0]; // Suponiendo que las coordenadas son un anillo exterior

    if (coordinates.length > 0) {
      // Inicializa las sumas de latitud y longitud
      let sumLatitud = 0;
      let sumLongitud = 0;

      // Suma las coordenadas de los vértices
      for (const coord of coordinates) {
        sumLatitud += coord[1];
        sumLongitud += coord[0];
      }

      // Calcula el centro dividiendo por el número de vértices
      const centroLatitud = sumLatitud / coordinates.length;
      const centroLongitud = sumLongitud / coordinates.length;

      return [centroLongitud, centroLatitud]; // Importante: [longitud, latitud]
    }
  }

  return null; // Devuelve null si no se pudo calcular el centro
}

function calculoDePoligonos(geoJSON) {
  const coordinates = geoJSON; // Suponiendo que las coordenadas son un anillo exterior

  if (coordinates.length > 0) {
    // Inicializa las sumas de latitud y longitud
    let sumLatitud = 0;
    let sumLongitud = 0;

    // Suma las coordenadas de los vértices
    for (const coord of coordinates) {
      sumLatitud += coord[1];
      sumLongitud += coord[0];
    }

    // Calcula el centro dividiendo por el número de vértices
    const centroLatitud = sumLatitud / coordinates.length;
    const centroLongitud = sumLongitud / coordinates.length;

    return [centroLongitud, centroLatitud]; // Importante: [longitud, latitud]
  }
}

function calcularCentroMultiPoligonos(geoJSON) {
  const { type, coordinates } = geoJSON.geometry;
  // Caso para múltiples polígonos
  const centros = coordinates.map((polygonCoordinates) =>
    calculoDePoligonos(polygonCoordinates[0])
  );

  // Calcula el centro promedio de los polígonos
  if (centros.length > 0) {
    const sumLatitud = centros.reduce((sum, centro) => sum + centro[1], 0);
    const sumLongitud = centros.reduce((sum, centro) => sum + centro[0], 0);

    const centroLatitud = sumLatitud / centros.length;
    const centroLongitud = sumLongitud / centros.length;

    return [centroLongitud, centroLatitud];
  }

  return null;
}

export default class MapaAnalisis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ciudad: "",
      valor: 0,
      rangos: [],
      coordenadas: [-39.821148, -73.237661],
      marcas: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.ciudad !== this.props.ciudad ||
      prevProps.valor !== this.props.valor ||
      prevProps.rangos !== this.props.rangos
    ) {
      this.actualizarEstadoLocal();
    }
  }

  actualizarEstadoLocal() {
    // Actualiza el estado local con los nuevos props
    this.setState(
      {
        ciudad: this.props.ciudad,
        valor: this.props.valor,
        rangos: this.props.rangos,
      },
      () => {
        this.buscarPosicion();
        this.setState({ marcas: [] }, () => {
          this.setState({ marcas: this.crearCircleMarkers() });
        });
      }
    );
  }

  buscarPosicion() {
    
    let ciudadGeometry = [];

    try {
    // Encuentra la geometría correspondiente a la ciudad en el archivo GeoJSON
    ciudadGeometry = geoJsonData.features.find((feature) =>
      this.state.ciudad[0].urbano.includes(feature.properties.URBANO)
    );
    }catch (error){
      return 0;
    };


    if (ciudadGeometry) {
      // Extrae las coordenadas de la geometría
      var coordinates = [0, 0];
      if (ciudadGeometry.geometry.type === "Polygon") {
        coordinates = calcularCentroPoligono(ciudadGeometry);
      } else {
        console.log(this.state.ciudad[0].urbano);
        coordinates = calcularCentroMultiPoligonos(ciudadGeometry);
      }

      coordinates = [coordinates[1], coordinates[0]];
      this.setState({ coordenadas: coordinates }, () => {
        console.log(this.state.coordenadas);
      });
    }
  }

  crearCircleMarkers() {
    var color = "#fa5f49";

    if (this.state.rangos) {
      if (this.state.valor > this.state.rangos[0]) {
        color = "#fa5f49";
      }
      if (this.state.valor > this.state.rangos[1]) {
        color = "#f9a59a";
      }
      if (this.state.valor > this.state.rangos[2]) {
        color = "#f9d99a";
      }
      if (this.state.valor > this.state.rangos[3]) {
        color = "#add5fa";
      }
      if (this.state.valor > this.state.rangos[4]) {
        color = "#95b8f6";
      }
      if (this.state.valor > this.state.rangos[5]) {
        color = "#005cfa";
      }
    }

    console.log(color);
    // Crea un CircleMarker para la ciudad
    try{
    return (
      <CircleMarker
        center={this.state.coordenadas} // Importante: [latitud, longitud]
        radius={30} // Puedes ajustar el tamaño del círculo según tus preferencias
        color={color} // Puedes ajustar el color del círculo
        fillOpacity={0.9} // Ajusta la opacidad del círculo
        weight= {4}
      >
        <Popup open={true}>
          <h6 className="text-center">{this.state.ciudad[0].urbano}</h6>
          <p className="text-center"> Valor: {this.state.valor}</p>
        </Popup>
        <Tooltip direction='top' opacity={1} >
           <span> {this.state.ciudad[0].urbano} </span>
         </Tooltip>
      </CircleMarker>
    );}catch(error){
      return <></>
    }
  }

  obtenerMarca() {
    if (this.state.ciudad) {
      return this.crearCircleMarkers();
    }
  }

  render() {

    return (
      <MapContainer
        center={this.state.coordenadas}
        zoom={11}
        scrollWheelZoom={false}
        className="mapaDeServicios"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoJsonData}
          style={(feature) => ({
            fillColor: "grey", // Color predeterminado si no se proporciona uno
            weight: 3,
            opacity: 1,
            color: "grey",
            dashArray: "2",
            fillOpacity: 0.3,
          })}
        />
        <div className="windrose-container">
          <WindroseControl />
          {/* Agrega el componente del rosa de los vientos */}
        </div>
        {/*<ZoomControl position="topright" />*/}
        {this.state.marcas}
        <ScaleControl imperial={false} position="bottomright" />
        <UpdateMapCentre mapCentre={this.state.coordenadas} />
      </MapContainer>
    );
  }
}
