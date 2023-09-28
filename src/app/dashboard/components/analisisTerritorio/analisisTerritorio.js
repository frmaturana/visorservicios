import React from "react";
import "./analisisTerritorio.css";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
//import RadarChartAnalisis from "./radarChart";
import dynamic from "next/dynamic";
import manchasUrbanas from "../../../../../public/data/Mancha_Urbana_2017.json";
import Multiselect from "multiselect-react-dropdown";
import ValoresAnalisis from "./valoresAnalisis";

const MapaAnalisis = dynamic(() => import("./mapaAnalisis"), { ssr: false });

const RadarChartAnalisis = dynamic(() => import("./radarChart"), {
  ssr: false,
});



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

export default class AnalisisTerritorio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indiceDimension: props.indiceDimension,
      indiceProvisionCiudad: props.indiceProvisionCiudad,
      rangosIndicadores: props.rangosIndicadores,
      rangosDimensiones: props.rangosDimensiones,
      rangosIndiceProvision: props.rangosIndiceProvision,
      valorPorCiudadIndicador: props.valorPorCiudadIndicador,
      mostrarIndiceDimension: props.indiceDimension,
      mostrarIndiceProvisionCiudad: props.indiceProvisionCiudad,
      mostrarRangosIndicadores: props.rangosIndicadores,
      mostrarRangosDimensiones: props.rangosDimensiones,
      mostrarRangosIndiceProvision: props.rangosIndiceProvision,
      mostrarValorPorCiudadIndicador: props.valorPorCiudadIndicador,
      nombreIndicadores: props.nombreIndicadores,
      zonasUrbanas: [],
      ciudad: "",
      listaIndicadores: [],
      selectedUrbanosDimensiones: [],
      selectedUrbanosServicios: [],
      comparativoDimensiones: [],
      NombreServicioComparativa: { nombre: "Seleccione un servicio" },
      tipo: "",
      subTipo: "",
      valores: {
        valor: 0,
        maximo: 0,
        minimo: 0,
        mediana: 0,
        promedio: 0,
        rangos: [],
      },
    };
  }

  componentDidUpdate(prevProps) {
    // Verifica si los props han cambiado y actualiza el estado local
    if (
      prevProps.indiceDimension !== this.props.indiceDimension ||
      prevProps.indiceProvisionCiudad !== this.props.indiceProvisionCiudad ||
      prevProps.rangosIndicadores !== this.props.rangosIndicadores ||
      prevProps.rangosDimensiones !== this.props.rangosDimensiones ||
      prevProps.rangosIndiceProvision !== this.props.rangosIndiceProvision ||
      prevProps.valorPorCiudadIndicador !==
        this.props.valorPorCiudadIndicador ||
      prevProps.nombreIndicadores !== this.props.nombreIndicadores
    ) {
      this.actualizarEstadoLocal();
    }
  }

  actualizarEstadoLocal() {
    // Actualiza el estado local con los nuevos props
    this.setState({
      indiceDimension: this.props.indiceDimension,
      indiceProvisionCiudad: this.props.indiceProvisionCiudad,
      rangosIndicadores: this.props.rangosIndicadores,
      rangosDimensiones: this.props.rangosDimensiones,
      rangosIndiceProvision: this.props.rangosIndiceProvision,
      valorPorCiudadIndicador: this.props.valorPorCiudadIndicador,
      nombreIndicadores: this.props.nombreIndicadores,
    });
  }

  obtenerZonasUrbanas = () => {
    const zonasUrbanas = [];
    for (let i = 0; i < manchasUrbanas.features.length; i++) {
      const poligono = manchasUrbanas.features[i];
      if (poligono.properties.URBANO) {
        zonasUrbanas.push({
          comuna: poligono.properties.COMUNA,
          nombreComuna: poligono.properties.NOM_COMUNA,
          urbano: poligono.properties.URBANO,
          region: poligono.properties.REGION,
          nombreRegion: poligono.properties.NOM_REGION,
        });
      }
    }
    return zonasUrbanas;
  };

  cambiarValores = (subTipo) => {
    
    this.setState({ subTipo: subTipo }, () => {
      if (this.state.tipo == "Previsión" && subTipo !== "" && this.state.ciudad[0]) {
        const ciudadEncontrada = this.buscarCiudad(
          this.state.ciudad[0],
          this.state.indiceProvisionCiudad,
          "Indice provisión",
          "Entidad urbana"
        );
        const valoresCiudadesServicios =
          this.obtenerValoresPorServicioDeCiudades(
            this.state.indiceProvisionCiudad,
            "Indice provisión"
          );
        const rangosIndiceProvision = this.obtenerRangosIndiceProvision();

        const { maximo, minimo, mediana, promedio } = this.calcularEstadisticas(
          valoresCiudadesServicios
        );

        console.log(this.state.tipo)
        this.setState({
          valores: {
            valor: ciudadEncontrada,
            maximo: maximo,
            minimo: minimo,
            mediana: mediana,
            promedio: promedio,
            rangos: rangosIndiceProvision,
          },
        });
      } else if (this.state.tipo == "Dimensión" && subTipo !== "" && this.state.ciudad[0]) {
         // DIMENSIONES
        const ciudadEncontrada = this.buscarCiudad(
          this.state.ciudad[0],
          this.state.indiceDimension,
          this.state.subTipo,
          "Entidad urbana/dimensión"
        );

        const valoresCiudadesServicios =
          this.obtenerValoresPorServicioDeCiudades(
            this.state.indiceDimension,
            this.state.subTipo
          );

        const rangosIndiceDimension = this.obtenerRangosIndiceDimension(
          this.state.subTipo
        );
        const { maximo, minimo, mediana, promedio } = this.calcularEstadisticas(
          valoresCiudadesServicios
        );

        this.setState({
          valores: {
            valor: ciudadEncontrada,
            maximo: maximo,
            minimo: minimo,
            mediana: mediana,
            promedio: promedio,
            rangos: rangosIndiceDimension,
          },
        });
      } else if (this.state.tipo === "Servicio" && subTipo !== "" && this.state.ciudad[0]) {
        const subTipo = this.state.subTipo.split("-");
        const ciudadEncontrada = this.buscarCiudad(
          this.state.ciudad[0],
          this.state.valorPorCiudadIndicador,
          subTipo[0],
          "Entidad urbana"
        );

        const valoresCiudadesServicios =
          this.obtenerValoresPorServicioDeCiudades(
            this.state.valorPorCiudadIndicador,
            subTipo[0]
          );

        const rangosIndicadores = this.obtenerRangosIndicadores(
          subTipo[0],
          this.state.ciudad[0].nombreRegion
        );

        const { maximo, minimo, mediana, promedio } = this.calcularEstadisticas(
          valoresCiudadesServicios
        );

        this.setState({
          valores: {
            valor: ciudadEncontrada,
            maximo: maximo,
            minimo: minimo,
            mediana: mediana,
            promedio: promedio,
            rangos: rangosIndicadores,
          },
        });
      } else {
        // Dejar en 0
        this.setState({
          valores: {
            valor: 0,
            maximo: 0,
            minimo: 0,
            mediana: 0,
            promedio: 0,
            rangos: [],
          },
        });
      }
    });
  };

  calcularEstadisticas = (listaDeValores) => {
    // Calcula el máximo
    const maximo = Math.max(...listaDeValores);

    // Calcula el mínimo
    const minimo = Math.min(...listaDeValores);

    // Calcula la mediana
    const sortedNumeros = [...listaDeValores].sort((a, b) => a - b);
    const middle = Math.floor(sortedNumeros.length / 2);
    const mediana =
      sortedNumeros.length % 2 === 0
        ? (sortedNumeros[middle - 1] + sortedNumeros[middle]) / 2
        : sortedNumeros[middle];

    // Calcula el promedio
    const promedio =
      listaDeValores.reduce((total, numero) => total + numero, 0) /
      listaDeValores.length;

    // Actualiza el estado con los resultados
    return { maximo, minimo, mediana, promedio };
  };

  obtenerValoresPorServicioDeCiudades = (tipo, subTipo) => {
    return tipo.map((valor) => valor[subTipo]);
  };

  obtenerRangosIndiceProvision = () => {
    return [
      this.state.rangosIndiceProvision[0]["Rango 1"],
      this.state.rangosIndiceProvision[0]["Rango 2"],
      this.state.rangosIndiceProvision[0]["Rango 3"],
      this.state.rangosIndiceProvision[0]["Rango 4"],
      this.state.rangosIndiceProvision[0]["Rango 5"],
      this.state.rangosIndiceProvision[0]["Rango 6"],
    ];
  };

  obtenerRangosIndiceDimension = (dimension) => {
    const valores = this.state.rangosDimensiones.filter(
      (valor) => valor["Dimension"] === dimension
    );
    return [
      valores[0]["Empieza_rang1"],
      valores[0]["Termina_rang1_Empie_rang2"],
      valores[0]["Termina_rang2_Empie_rang3"],
      valores[0]["Termina_rang3_Empie_rang4"],
      valores[0]["Termina_rang4_Empie_rang5"],
      valores[0]["Termina_rang5"],
    ];
  };

  obtenerRangosIndicadores = (indicador, region) => {

    const valores = this.state.rangosIndicadores.filter(
      (valor) =>
        valor["variable"] === indicador &&
        quitarTildes(region).includes(valor["Region"].toUpperCase())
    );
    return [
      valores[0]["Bajo"],
      valores[0]["Termina_rang1_Empie_rang2"],
      valores[0]["Termina_rang2_Empie_rang3"],
      valores[0]["Termina_rang3_Empie_rang4"],
      valores[0]["Termina_rang4_Empie_rang5"],
      valores[0]["Alto"],
    ];
  };

  buscarCiudad = (ciudadBuscada, tipo, subTipo, columnaCiudad) => {
    let ciudadEncontrada = tipo.find((ciudad) =>
      quitarTildes(ciudad[columnaCiudad].toUpperCase()).includes(
        quitarTildes(ciudadBuscada.urbano.toUpperCase())
      )
    );

    if (!ciudadEncontrada) {
      ciudadEncontrada = tipo.find((ciudad) =>
        quitarTildes(ciudad[columnaCiudad].toUpperCase()).includes(
          quitarTildes(ciudadBuscada["nombreComuna"].toUpperCase())
        )
      );
    }

    if (!ciudadEncontrada) {
      ciudadEncontrada = tipo.find((ciudad) =>
        quitarTildes(ciudadBuscada.urbano.toUpperCase()).includes(
          quitarTildes(ciudad[columnaCiudad].toUpperCase())
        )
      );
    }
    return ciudadEncontrada[subTipo];
  };

  opcionesDeTipo = () => {
    if (this.state.tipo == "Previsión") {
      return <option value="Previsión">Previsión</option>;
    }
    if (this.state.tipo == "Dimensión") {
      // Usamos un Set para almacenar dimensiones únicas
      const dimensionesUnicas = new Set();

      // Llenamos el Set con dimensiones únicas
      this.state.nombreIndicadores.forEach((indicador) => {
        dimensionesUnicas.add(indicador["Dimensión"]);
      });

      // Mapeamos el Set para renderizar las opciones
      const opcionesDimensiones = Array.from(dimensionesUnicas).map(
        (dimension, index) => (
          <option key={index} value={dimension}>
            {dimension}
          </option>
        )
      );

      return (
        <>
          <option value="" >Seleccionar Dimensión</option>
          {opcionesDimensiones}
        </>
      );
    }
    if (this.state.tipo === "Servicio") {
      return (
        <>
          <option value="">Seleccionar Servicio</option>
          {this.state.nombreIndicadores.map((indicador) => {
            return (
              <option
                key={indicador["Codificación"]}
                value={`${indicador["Codificación"]}-${indicador["Indicador o variable"]}`}
              >
                {indicador["Indicador o variable"]}
              </option>
            );
          })}
        </>
      );
    }
    return <option> Seleccionar tipo</option>;
  };

  render() {
    const listaZonasUrbanas = this.obtenerZonasUrbanas();
    return (
      <div className="analisisTerritorio p-1">
        <Row className="text-center pt-4">
          <h3 className="titulos-dashboard">ANÁLISIS POR CIUDAD</h3>
        </Row>
        <Container>
          <Row className="p-1 analisis-big-box">
            <Col xl className="analisis-boxs m-3 py-3">
              <div
                className="d-flex flex-column justify-content-between"
                style={{ height: "100%" }}
              >
                <h3 className="titulos-dashboard p-2">PANEL DE SELECCIÓN</h3>
                <div className="p-2">
                  ENTIDAD URBANA
                  <Multiselect
                    selectedValues={this.state.ciudad}
                    onSelect={(e) => {
                      this.setState({ ciudad: e });
                      this.cambiarValores(this.state.subTipo);
                    }}
                    options={listaZonasUrbanas}
                    displayValue="urbano"
                    groupBy="nombreRegion"
                    singleSelect
                    style={{
                      chips: {
                        background: "#634F4E",
                        color: "white",
                      },
                      searchBox: {
                        /*maxHeight:"74px"*/
                      },
                    }}
                  />
                </div>
                <div className="p-2 ">
                  TIPO
                  <Form.Select
                    aria-label="Default select"
                    onChange={(e) => {
                      this.setState({ tipo: e.target.value });
                      if (e.target.value == "Previsión") {
                        this.setState({ subTipo: e.target.value });
                        this.cambiarValores(e.target.value);
                      }
                    }}
                    value={this.state.tipo}
                  >
                    <option>Tipo</option>
                    <option value="Previsión">Previsión</option>
                    <option value="Dimensión">Dimensión</option>
                    <option value="Servicio">Servicio</option>
                  </Form.Select>
                </div>

                <div className="p-2">
                  SELECCIONAR{" "}
                  {this.state.tipo != ""
                    ? this.state.tipo.toUpperCase()
                    : "MEDIDA"}
                  <Form.Select
                    aria-label="Default select"
                    value={this.state.subTipo}
                    onChange={(e) => {
                      this.setState({ subTipo: e.target.value });
                      this.cambiarValores(e.target.value);
                    }}
                  >
                    {this.opcionesDeTipo()}
                  </Form.Select>
                </div>
                <div className="p-2 py-3">
                  <a>
                    <Button
                      className="color-terciario w-100"
                      onClick={() => {
                        this.setState({
                          tipo: "",
                          subTipo: "",
                          ciudad: "",
                        });
                        this.cambiarValores();
                      }}
                    >
                      <img src="./plusIcon.svg" alt="Plus Icon" /> Limpiar
                      gráfico
                    </Button>
                  </a>
                </div>
              </div>
            </Col>
            <Col xl className="analisis-boxs m-3">
              <div>
                <ValoresAnalisis
                  valor={this.state.valores.valor}
                  maximo={this.state.valores.maximo}
                  minimo={this.state.valores.minimo}
                  mediana={this.state.valores.mediana}
                  promedio={this.state.valores.promedio}
                  rangos={this.state.valores.rangos}
                ></ValoresAnalisis>
              </div>
            </Col>
            <Col
              xl
              className="analisis-boxs m-3"
              style={{ padding: "0px", minHeight: "358.294px" }}
            >
              <MapaAnalisis 
              ciudad={this.state.ciudad}
              valor={this.state.valores.valor}
              rangos={this.state.valores.rangos}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
