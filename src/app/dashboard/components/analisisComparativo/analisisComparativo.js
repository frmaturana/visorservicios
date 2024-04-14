import React from "react";
import "./analisisComparativo.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import dynamic from "next/dynamic";
import Multiselect from "multiselect-react-dropdown";

const MapaComparativo = dynamic(() => import("./mapaComparativo"), {
  ssr: false,
});

const GradicoComparativoCiudadesDimensiones = dynamic(
  () => import("./graficoComparativoCiudadesDimensiones"),
  {
    ssr: false,
  }
);

const GraficoComparativoUnServicio = dynamic(
  () => import("./graficoComparativoUnServicio"),
  {
    ssr: false,
  }
);

import manchasUrbanas from "../../../../../public/data/Mancha_Urbana_2017.json";

function sonListasIguales(lista1, lista2) {
  return JSON.stringify(lista1) === JSON.stringify(lista2);
}

export default class AnalisisComparativo extends React.Component {
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
      ciudades: [],
      listaIndicadores: [],
      selectedUrbanosDimensiones: [],
      selectedUrbanosServicios: [],
      comparativoDimensiones: [],
      NombreServicioComparativa: { nombre: "Seleccione un servicio" },
    };
  }

  componentDidMount() {
    const zonasUrbanas = this.obtenerZonasUrbanas();
    const ciudadesRios = zonasUrbanas
      .map((objeto) => {
        if (objeto.region === "14") {
          return { nombre: objeto.urbano, region: objeto.region };
        }
        return null;
      })
      .filter((ciudad) => ciudad !== null);

    const ciudadesAraucania = zonasUrbanas
      .map((objeto) => {
        if (objeto.region === "9") {
          return { nombre: objeto.urbano, region: objeto.region };
        }
        return null;
      })
      .filter((ciudad) => ciudad !== null);

    this.setState({
      zonasUrbanas: zonasUrbanas,
      ciudades: [
        { nombre: "REGIÓN DE LA ARAUCANÍA", region: "9" },
        ...ciudadesAraucania,
        { nombre: "REGÍON DE LOS RÍOS", region: "14" },
        ...ciudadesRios,
      ],
    });
  }

  actualizarListaDimensionesIndicadores = () => {
    //Dimensiones y servicios
    const Dimensiones = this.state.nombreIndicadores
      .reduce((resultado, objeto) => {
        const nombreDimension = objeto["Dimensión"];
        if (!resultado.includes(nombreDimension)) {
          resultado.push(nombreDimension);
        }
        return resultado;
      }, [])
      .map((nombreDimension) => nombreDimension);

    const listaIndicadores = [];

    for (var i = 0; i < Dimensiones.length; i++) {
      var indicadores = this.state.nombreIndicadores
        .map((indicador) => {
          if (indicador["Dimensión"] === Dimensiones[i]) {
            return indicador["Indicador o variable"];
          }
          return null;
        })
        .filter((indicador) => indicador !== null);
      listaIndicadores.push(Dimensiones[i]);
      listaIndicadores.push(...indicadores);
    }
    return listaIndicadores;
  };

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

  handleComparativoDimensionesNoSelect = (selectedList) => {
    this.setState({
      comparativoDimensiones: selectedList,
    });
  };

  handleComparativoDimensionesSelect = (selectedList) => {
    this.setState({
      comparativoDimensiones: selectedList,
    });
  };

  handleSelectUrbanosDimensiones = (selectedList) => {
    // Filtra los elementos con urbano igual a "TODOS"
    const elementosConTodos = selectedList.filter(
      (elemento) =>
        elemento.urbano === "TODA LA REGIÓN DE LOS RÍOS" ||
        elemento.urbano === "TODA LA REGIÓN DE LA ARAUCANÍA"
    );
    const elementosConTodosAnterior =
      this.state.selectedUrbanosDimensiones.filter(
        (elemento) =>
          elemento.urbano === "TODA LA REGIÓN DE LOS RÍOS" ||
          elemento.urbano === "TODA LA REGIÓN DE LA ARAUCANÍA"
      );

    if (!sonListasIguales(elementosConTodosAnterior, elementosConTodos)) {
      if (elementosConTodosAnterior.length < elementosConTodos.length) {
        // Cuando hay un nuevo "todos"
        const regionObjtivo = elementosConTodos.filter(
          (elemento) => !elementosConTodosAnterior.includes(elemento)
        );
        const urbanoDeRegion = this.obtenerZonasUrbanas().filter(
          (item) => item.nombreRegion === regionObjtivo[0].nombreRegion
        );
        const lista = [...new Set([...selectedList, ...urbanoDeRegion])];
        const listaSinRepetidos = [];
        const comprobarDuplicados = {};

        for (const elemento of lista) {
          const claveUnica = elemento.urbano; // O usa otra clave única según tus necesidades

          if (!comprobarDuplicados[claveUnica]) {
            listaSinRepetidos.push(elemento);
            comprobarDuplicados[claveUnica] = true;
          }
        }
        this.setState({ selectedUrbanosDimensiones: listaSinRepetidos });
      } else {
        // Cuando se desmarca uno "todos"
        const regionObjtivo = elementosConTodosAnterior.filter(
          (elemento) => !elementosConTodos.includes(elemento)
        );
        const lista = selectedList.filter(
          (elemento) => elemento.nombreRegion !== regionObjtivo[0].nombreRegion
        );
        this.setState({ selectedUrbanosDimensiones: lista });
      }
    } else {
      if (this.state.selectedUrbanosDimensiones.length > selectedList.length) {
        const elementoQuitado = this.state.selectedUrbanosDimensiones.filter(
          (elemento) => !selectedList.includes(elemento)
        );
        selectedList = selectedList.filter((elemento) => {
          // Compara cada elemento con el objeto que deseas eliminar
          return (
            elemento.urbano !== "TODA LA " + elementoQuitado[0].nombreRegion
          );
        });
      } else {
      }

      this.setState({ selectedUrbanosDimensiones: selectedList });
    }
  };

  handleSelectUrbanosServicios = (selectedList) => {
    // Filtra los elementos con urbano igual a "TODOS"
    const elementosConTodos = selectedList.filter(
      (elemento) =>
        elemento.urbano === "TODA LA REGIÓN DE LOS RÍOS" ||
        elemento.urbano === "TODA LA REGIÓN DE LA ARAUCANÍA"
    );
    const elementosConTodosAnterior =
      this.state.selectedUrbanosServicios.filter(
        (elemento) =>
          elemento.urbano === "TODA LA REGIÓN DE LOS RÍOS" ||
          elemento.urbano === "TODA LA REGIÓN DE LA ARAUCANÍA"
      );

    if (!sonListasIguales(elementosConTodosAnterior, elementosConTodos)) {
      if (elementosConTodosAnterior.length < elementosConTodos.length) {
        // Cuando hay un nuevo "todos"
        const regionObjtivo = elementosConTodos.filter(
          (elemento) => !elementosConTodosAnterior.includes(elemento)
        );
        const urbanoDeRegion = this.obtenerZonasUrbanas().filter(
          (item) => item.nombreRegion === regionObjtivo[0].nombreRegion
        );
        const lista = [...new Set([...selectedList, ...urbanoDeRegion])];
        const listaSinRepetidos = [];
        const comprobarDuplicados = {};

        for (const elemento of lista) {
          const claveUnica = elemento.nombreComuna; // O usa otra clave única según tus necesidades

          if (!comprobarDuplicados[claveUnica]) {
            listaSinRepetidos.push(elemento);
            comprobarDuplicados[claveUnica] = true;
          }
        }
        this.setState({ selectedUrbanosServicios: listaSinRepetidos });
      } else {
        // Cuando se desmarca uno "todos"
        const regionObjtivo = elementosConTodosAnterior.filter(
          (elemento) => !elementosConTodos.includes(elemento)
        );
        const urbanoDeRegion = this.obtenerZonasUrbanas().filter(
          (item) => item.nombreRegion === regionObjtivo[0].nombreRegion
        );
        const lista = urbanoDeRegion.filter((elemento) =>
          selectedList.includes(elemento)
        );
        this.setState({ selectedUrbanosServicios: lista });
      }
    } else {
      if (this.state.selectedUrbanosServicios.length > selectedList.length) {
        const elementoQuitado = this.state.selectedUrbanosServicios.filter(
          (elemento) => !selectedList.includes(elemento)
        );
        selectedList = selectedList.filter((elemento) => {
          // Compara cada elemento con el objeto que deseas eliminar
          return (
            elemento.urbano !== "TODA LA " + elementoQuitado[0].nombreRegion
          );
        });
      } else {
      }

      this.setState({ selectedUrbanosServicios: selectedList });
    }
  };

  handleSelectUrbanosMapa = (selectedList) => {
    this.setState({ selectedUrbanosServicios: selectedList });
  };

  handleNoSelectUrbanosMapa = (selectedList) => {
    this.setState({ selectedUrbanosServicios: selectedList });
  };

  render() {
    const listaDimensionesIndicadores =
      this.actualizarListaDimensionesIndicadores();
    const listaZonasUrbanas = this.obtenerZonasUrbanas();
    const nombresRegionesSet = new Set();

    const nombresRegiones = listaZonasUrbanas.reduce((result, ciudad) => {
      if (!nombresRegionesSet.has(ciudad.nombreRegion)) {
        nombresRegionesSet.add(ciudad.nombreRegion);
        result.push({
          nombreRegion: ciudad.nombreRegion,
          urbano: "TODA LA " + ciudad.nombreRegion,
        });
      }
      return result;
    }, []);

    const ciudadesComparativa = this.state.selectedUrbanosDimensiones.filter(
      (elemento) =>
        elemento.urbano !== "TODA LA REGIÓN DE LOS RÍOS" &&
        elemento.urbano !== "TODA LA REGIÓN DE LA ARAUCANÍA"
    );

    return (
      <div className="analisisComparativo p-1 pt-4  mt-3">
        <h3 className="titulos-dashboard text-center">ANÁLISIS COMPARATIVO ENTRE CIUDADES</h3>
        <Container>
          <Row className="fila-comparativo">
            <Col lg className="analisis-boxs m-3 py-3 columna-comparativo">
              <GradicoComparativoCiudadesDimensiones
                ciudades={this.state.selectedUrbanosServicios}
                servicios={this.state.valorPorCiudadIndicador}
                listaDeServiciosAMostrar={this.state.comparativoDimensiones}
                rangos={this.state.rangosIndicadores}
              />
            </Col>
            <Col
              lg
              className="analisis-boxs m-3 py-3 panel-comparativo panle-comparativo-ancho-responsivo"
              style={{ maxWidth: "358.294px" }}
            >
              <div className="d-flex flex-column">
                <div className="p-2">
                  <a>
                    <Button
                      className="color-terciario w-100"
                      onClick={() => {
                        this.setState({
                          comparativoDimensiones: [],
                          selectedUrbanosServicios: [],
                        });
                      }}
                    >
                      <img src="./plusIcon.svg" alt="Plus Icon" /> Limpiar
                      gráfico y mapa
                    </Button>
                  </a>
                </div>
                <div className="p-2">
                  CIUDADES
                  <Multiselect
                    selectedValues={this.state.selectedUrbanosServicios}
                    onSelect={this.handleSelectUrbanosMapa}
                    onRemove={this.handleNoSelectUrbanosMapa}
                    options={listaZonasUrbanas}
                    placeholder={`${this.state.selectedUrbanosServicios.length} ciudades seleccionadas`}
                    displayValue="urbano"
                    groupBy="nombreRegion"
                    selectionLimit={10}
                    showCheckbox
                    style={{
                      chips: {
                        background: "#634F4E",
                        zIndex: -1000,
                        display: "none",
                      },
                      searchBox: {
                        /*maxHeight:"74px"*/
                      },
                    }}
                  />
                </div>
                <div className="p-2 ">
                  DIMENSIÓN / SERVICIOS
                  <div>
                    <Multiselect
                      selectedValues={this.state.comparativoDimensiones}
                      onSelect={this.handleComparativoDimensionesNoSelect}
                      onRemove={this.handleComparativoDimensionesSelect}
                      options={this.state.nombreIndicadores}
                      displayValue="Indicador o variable"
                      placeholder={`${this.state.comparativoDimensiones.length} servicios seleccionadas`}
                      groupBy="Dimensión"
                      selectionLimit={7}
                      showCheckbox
                      style={{
                        chips: {
                          background: "#634F4E",
                          zIndex: -1000,
                          display: "none",
                        },
                        searchBox: {
                          /*maxHeight:"74px"*/
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              className="analisis-boxs m-3"
              style={{ padding: "0px", minHeight: "358.294px", zIndex: "1"}}
            >
              <MapaComparativo
                ciudades={this.state.selectedUrbanosServicios}
                servicios={this.state.comparativoDimensiones}
                dataServicios={this.state.valorPorCiudadIndicador}
                rangos={this.state.rangosIndicadores}
              />
            </Col>
          </Row>
          <hr />
          <Row className="fila-comparativo">
            <Col
              lg
              className="analisis-boxs m-3 py-3 columna-comparativo"
              style={{ paddingLeft: "30px" }}
            >
              <GraficoComparativoUnServicio
                ciudades={this.state.selectedUrbanosDimensiones}
                servicio={this.state.NombreServicioComparativa}
                servicios={this.state.valorPorCiudadIndicador}
              />
            </Col>
            <Col
              lg
              className="panle-comparativo-ancho-responsivo"
              style={{ maxWidth: "388.294px" }}
            >
              <Row>
                <Col className="analisis-boxs panel-comparativo m-3 py-3">
                  <div>
                    <div className="p-2">
                      <a>
                        <Button
                          className="color-terciario w-100"
                          onClick={() => {
                            this.setState({
                              selectedUrbanosDimensiones: [],
                            });
                          }}
                        >
                          <img src="./plusIcon.svg" alt="Plus Icon" /> Limpiar
                          gráfico
                        </Button>
                      </a>
                    </div>
                    <div className="p-2">
                      CIUDADES
                      <Multiselect
                        selectedValues={this.state.selectedUrbanosDimensiones}
                        onSelect={this.handleSelectUrbanosDimensiones}
                        onRemove={this.handleSelectUrbanosDimensiones}
                        options={[...nombresRegiones, ...listaZonasUrbanas]}
                        displayValue="urbano"
                        groupBy="nombreRegion"
                        placeholder={`${this.state.selectedUrbanosDimensiones.length} ciudades seleccionadas`}
                        showCheckbox
                        style={{
                          chips: {
                            background: "#634F4E",
                            zIndex: -1000,
                            display: "none",
                          },
                          searchBox: {
                            /*maxHeight:"74px"*/
                          },
                        }}
                      />
                    </div>
                    <div className="p-2">
                      SERVICIOS
                      <Form.Select
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const [codificacion, nombre] =
                            selectedValue.split("-"); // Cambia '-' al carácter que desees usar como separador
                          this.setState({
                            NombreServicioComparativa: {
                              Codificación: codificacion,
                              nombre: nombre,
                            },
                          });
                        }}
                      >
                        <option>Servicios</option>
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
                      </Form.Select>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="flex-column align-items-center">
                <Col className="p-3 botones-panel">
                  <a href="http://fmaturana.cl/Fondecyt_1230159">
                    <Button className="color-primario w-100 mb-3">
                      <img src="./plusIcon.svg" alt="Plus Icon" /> Más información
                    </Button>
                  </a>
                  <a href="datosTest.json" download="datosTest.json">
                    <Button className="color-secundario w-100">
                      <img src="./plusIcon.svg" alt="Plus Icon" /> Obtener datos
                    </Button>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
