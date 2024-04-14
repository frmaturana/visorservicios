import React , { Component } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  ScaleControl,
  MapControl,
  Marker,
  Popup,
  GeoJSON,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoJsonData from "../../../../../public/data/Mancha_Urbana_2017.json";
import { Form } from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image';


const position = [-38.99021947302409, -72.64751008365442];

function quitarTildes(cadena) {
  const tildes = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
  };
  // Reemplazar tildes
  cadena = cadena.replace(/[áéíóúÁÉÍÓÚ]/g, (letra) => tildes[letra] || letra);

  // Eliminar espacios al final de la cadena
  cadena = cadena.trim();

  return cadena;
}

const WindroseControl = () => {
  return (
    <div className="windrose-control">
      {/* Aquí puedes agregar tu imagen de rosa de los vientos */}
      <img src="norte.png" alt="Windrose" />
    </div>
  );
};

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

export default class MapaComparativo extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      ciudades: [],
      servicios: [],
      servicio: null,
      dataServicios: this.props.dataServicios,
      rangos: this.props.rangos,
      marcas: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ciudades !== prevProps.ciudades) {
      this.setState({
        ciudades: this.props.ciudades.map((ciudad) => ciudad.urbano),
      });
    }
    if (this.props.servicios !== prevProps.servicios) {
      this.setState({
        servicios: this.props.servicios.map((servicio) => servicio),
      });
    }
    if (this.props.dataServicios !== prevProps.dataServicios) {
      this.setState({
        dataServicios: this.props.dataServicios,
      });
    }
    if (this.props.rangos !== prevProps.rangos) {
      this.setState({
        rangos: this.props.rangos,
      });
    }
    if (
      this.state.servicio !== prevState.servicio ||
      this.state.ciudades !== prevState.ciudades
    ) {
      const marcas = this.crearCircleMarkers();
      this.setState({ marcas });
    }
  }

  obtenerDatosDeServicioDeCiudad(ciudadBuscada) {
    let ciudadEncontrada = this.state.dataServicios.find((ciudad) =>
      quitarTildes(ciudad["Entidad urbana"].toUpperCase()).includes(
        quitarTildes(ciudadBuscada.URBANO.toUpperCase())
      )
    );

    if (!ciudadEncontrada) {
      ciudadEncontrada = this.state.dataServicios.find((ciudad) =>
        quitarTildes(ciudad["Entidad urbana"].toUpperCase()).includes(
          quitarTildes(ciudadBuscada["NOM_COMUNA"].toUpperCase())
        )
      );
    }

    if (!ciudadEncontrada) {
      ciudadEncontrada = this.state.dataServicios.find((ciudad) =>
        quitarTildes(ciudadBuscada.URBANO.toUpperCase()).includes(
          quitarTildes(ciudad["Entidad urbana"].toUpperCase())
        )
      );
    }
    return ciudadEncontrada[this.state.servicio];
  }

  obtenerRangosDeServicio(region) {
    if (this.state.servicio) {
      const rangos = this.state.rangos.filter((rango) =>
        quitarTildes(region.toUpperCase()).includes(
          quitarTildes(rango.Region.toUpperCase())
        )
      );

      const rango = rangos.find(
        (rango) => rango.variable == this.state.servicio
      );

      if (rango) {
        return {
          bajo: rango.Bajo,
          tbajo: rango["Termina_rang1_Empie_rang2"],
          tmbajo: rango["Termina_rang2_Empie_rang3"],
          tmedio: rango["Termina_rang3_Empie_rang4"],
          tmalto: rango["Termina_rang4_Empie_rang5"],
          alto: rango.Alto,
        };
      }
    }
  }

  //Descargar
  handleDownloadMap = () => {
    domtoimage.toPng(document.getElementById('mapa'))
    .then(function (png) {
        window.saveAs(png, 'mapa-servicios.png');
    });
  };


  // Función para crear los CircleMarkers para ciudades destacadas
  crearCircleMarkers() {
    return this.state.ciudades.map((ciudad, index) => {
      // Encuentra la geometría correspondiente a la ciudad en el archivo GeoJSON
      const ciudadGeometry = geoJsonData.features.find(
        (feature) => feature.properties.URBANO === ciudad
      );
      if (ciudadGeometry) {
        // Extrae las coordenadas de la geometría
        var coordinates = [0, 0];
        if (ciudadGeometry.geometry.type === "Polygon") {
          coordinates = calcularCentroPoligono(ciudadGeometry);
        } else {
          coordinates = calcularCentroMultiPoligonos(ciudadGeometry);
        }

        //Busca el servicio correspondiente a la ciudad en el archivo GeoJSON
        const valorServicio = this.obtenerDatosDeServicioDeCiudad(
          ciudadGeometry.properties
        );

        const rango = this.obtenerRangosDeServicio(
          ciudadGeometry.properties.NOM_REGION
        );

        var color = "#fa5f49";
        //console.log(rango);

        if (rango) {
          if (valorServicio >= rango.bajo) {
            color = "#fa5f49";
          }
          if (valorServicio > rango.tbajo) {
            color = "#f9a59a";
          }
          if (valorServicio > rango.tmbajo) {
            color = "#f9d99a";
          }
          if (valorServicio > rango.tmedio) {
            color = "#add5fa";
          }
          if (valorServicio > rango.tmalto) {
            color = "#95b8f6";
          }
          if (valorServicio >= rango.talto) {
            color = "#005cfa";
          }
        }
        // Crea un CircleMarker para la ciudad
        return (
          <CircleMarker
            key={index}
            center={[coordinates[1], coordinates[0]]} // Importante: [latitud, longitud]
            radius={15} // Puedes ajustar el tamaño del círculo según tus preferencias
            color={color} // Puedes ajustar el color del círculo
            fillOpacity={0.9} // Ajusta la opacidad del círculo
          >
            <Popup open={true}>
              <h6 className="text-center">{ciudad}</h6>
              <p className="text-center"> Valor: {valorServicio}</p>
            </Popup>
          </CircleMarker>
        );
      }

      return null;
    });
  }

  render() {
    return (
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        className="mapaDeServicios"
        zoomControl={false}
        id={"mapa"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoJsonData}
          style={(feature) => ({
            fillColor: "grey", // Color predeterminado si no se proporciona uno
            weight: 2,
            opacity: 1,
            color: "grey",
            dashArray: "2",
            fillOpacity: 0.3,
          })}
        />
        <div className="windrose-container">
          <WindroseControl />{" "}
          {/* Agrega el componente del rosa de los vientos */}
        </div>
        <ZoomControl position="topright" />
        <ScaleControl imperial={false} position="bottomright" />
        {/* Agrega los CircleMarkers para ciudades destacadas */}
        {this.state.marcas}
        {/* Agrega la leyenda en la parte inferior derecha */}
        <div className="leyenda-container">
          <h5>Leyenda</h5>
          <div className="leyenda-item">
            <div className="color alto"></div>
            Alto
          </div>
          <div className="leyenda-item">
            <div className="color casi-alto"></div>
            {/*<p>Medio-Alto</p>*/}
          </div>
          <div className="leyenda-item">
            <div className="color medio-alto"></div>
            {/*<p>Medio-Alto</p>*/}
          </div>
          <div className="leyenda-item">
            <div className="color medio"></div>
            {/*<p>Medio</p>*/}
          </div>
          <div className="leyenda-item">
            <div className="color medio-bajo "></div>
            {/*<p>Medio-Bajo</p>*/}
          </div>
          <div className="leyenda-item">
            <div className="color bajo"></div>
            Bajo
          </div>
        </div>
        <div className="select-container">
          <Form.Select
            aria-label="Default select"
            onChange={(e) => {
              this.setState({ servicio: e.target.value });
              this.setState({ marcas: [] });
            }}
          >
            <option key={1}> Seleccionar un servicio</option>
            {this.state.servicios.map((servicio) => {
              return (
                <option
                  key={servicio["Codificación"]}
                  value={servicio["Codificación"]}
                >
                  {servicio["Indicador o variable"]}
                </option>
              );
            })}
            ;
          </Form.Select>
        </div>
      </MapContainer>
    );
  }
}
