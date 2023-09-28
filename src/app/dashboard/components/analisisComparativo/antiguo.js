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

export default class AnalisisComparativo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listaDeServicios: [
        "CAMAS HOSPITALARIAS",
        "CHILEXPRESS",
        "INDAP",
        "SAG",
        "CAPREDENA",
      ],
      listaDeServiciosAMostrar: [
        "CAMAS HOSPITALARIAS",
        "CHILEXPRESS",
        "INDAP",
        "SAG",
        "CAPREDENA",
      ],
      listaComunas: [
        "CUNCO",
        "CARAHUE",
        "LOS SAUCES",
        "VALDIVIA",
        "LOS LAGOS",
        "LA UNION",
      ],
      food: ["Burger", "Pizza", "Sandwich"],
    };
    this.establecerListaDeServicios =
      this.establecerListaDeServicios.bind(this);
  }

  establecerListaDeServicios(servicio) {
    this.setState({
      listaDeServicios: [...this.state.listaDeServicios, servicio],
    });
  }

  agregarServiciosAlistaDeServicios(servicio) {
    this.setState({
      listaDeServicios: [...this.state.listaDeServicios, servicio],
    });
  }

  eliminarServiciosAlistaDeServicios(servicio) {
    const nuevaLista = this.state.listaDeServicios.filter(
      (str) => str !== servicio
    );
    this.setState({ listaDeServicios: nuevaLista });
  }

  seleccionarComunasRegion = (valor) => {
    if (valor == "1") {
      this.setState({
        listaComunas: ["CUNCO", "CARAHUE", "LOS SAUCES"],
      });
    } else if (valor == "2") {
      this.setState({
        listaComunas: ["VALDIVIA", "LOS LAGOS", "LA UNION"],
      });
    } else {
      this.setState({
        listaComunas: ["VILCUN", "TOLTEN", "TEMUCO"],
      });
    }
  };

  seleccionarDimension = (valor) => {
    if (valor == "1") {
      this.setState({
        listaDeServicios: ["CHILEXPRESS"],
        listaDeServiciosAMostrar: ["CHILEXPRESS"],
      });
    } else if (valor == "2") {
      this.setState({
        listaDeServicios: ["INDAP", "SAG"],
        listaDeServiciosAMostrar: ["INDAP", "SAG"],
      });
    } else if (valor == "3") {
      this.setState({
        listaDeServicios: ["CAMAS HOSPITALARIAS"],
        listaDeServiciosAMostrar: ["CAMAS HOSPITALARIAS"],
      });
    } else {
      this.setState({
        listaDeServicios: [
          "CAMAS HOSPITALARIAS",
          "CHILEXPRESS",
          "INDAP",
          "SAG",
          "CAPREDENA",
        ],
        listaDeServiciosAMostrar: [
          "CAMAS HOSPITALARIAS",
          "CHILEXPRESS",
          "INDAP",
          "SAG",
          "CAPREDENA",
        ],
      });
    }
  };

  render() {
    return (
      <div className="analisisComparativo p-1 pt-4  mt-3">
        <h3 className="titulos-dashboard text-center">ANÁLISIS COMPARATIVO</h3>
        <Container>
          <Row>
            <Col
              className="analisis-boxs m-3"
              style={{ padding: "0px", minHeight: "358.294px" }}
            >
              <MapaComparativo />
            </Col>
          </Row>
          <Row className="fila-comparativo">
            <Col lg className="analisis-boxs m-3 py-3 columna-comparativo">
              <GradicoComparativoCiudadesDimensiones
                ciudades={this.state.listaComunas}
                servicios={this.props.servicios}
                listaDeServiciosAMostrar={this.state.listaDeServicios}
              />
            </Col>
            <Col
              lg
              className="analisis-boxs m-3 py-3 panel-comparativo panle-comparativo-ancho-responsivo"
              style={{ maxWidth: "358.294px" }}
            >
              <div
                className="d-flex flex-column justify-content-between"
                style={{ height: "100%" }}
              >
                <div className="p-2">
                  CIUDADES
                  <Form.Select aria-label="Default select">
                    <option>Ciudades</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </div>
                <div className="p-2 ">
                  {"DIMENSIÓN"}
                  <Form.Select aria-label="Default select">
                    <option>{"Dimensión"}</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </div>
                <div className="p-2 ">
                  {"DIMENSIÓN"}
                  <Multiselect
                    isObject={false}
                    onRemove={(event) => {
                      console.log(event);
                    }}
                    onSelect={(event) => {
                      console.log(event);
                    }}
                    options={this.state.food}
                    selectedValues={["Burger"]}
                    showCheckbox
                  />
                </div>
                <div className="p-2">
                  SERVICIOS
                  <Form.Select aria-label="Default select">
                    <option>Servicios</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="fila-comparativo">
            <Col
              lg
              className="analisis-boxs m-3 py-3 columna-comparativo"
              style={{ paddingLeft: "30px" }}
            >
              <GraficoComparativoUnServicio />
            </Col>
            <Col
              lg
              className="panle-comparativo-ancho-responsivo"
              style={{ maxWidth: "388.294px" }}
            >
              <Row>
                <Col className="analisis-boxs panel-comparativo m-3 py-3">
                  Otros parámetros??
                </Col>
              </Row>
              <Row className="flex-column align-items-center">
                <Col className="p-3 botones-panel">
                  <a href="http://fmaturana.cl/Fondecyt_1230159">
                    <Button className="color-primario w-100 mb-3">
                      <img src="./plusIcon.svg" alt="Plus Icon" /> Más
                      información
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


/* ---------------------------- */


import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./dashboardFunction.css";
import AnalisisTerritorio from "../analisisTerritorio/analisisTerritorio";
import AnalisisComparativo from "../analisisComparativo/analisisComparativo";
import data from "../../../datosTest.json";
import XLSX from "xlsx";


class DashboardFunction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ciudades: [],
      servicios: [],
      indiceDimension: [],
      indiceProvisionCiudad: [],
      rangosIndicadores: [],
      rangosDimensiones: [],
      rangosIndiceProvision: [],
      valorPorCIudadIndicador: [],
    };
  }

  // Función para cargar un archivo Excel
  cargarArchivoExcel = (ruta, estadoVariable) => {
    fetch(ruta)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const primeraHoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(primeraHoja);
        console.log(datos);

        // Actualiza la variable de estado correspondiente
        this.setState({ [estadoVariable]: datos });
      })
      .catch((error) => {
        console.error("Error al cargar el archivo .ods", error);
      });
  };

  componentDidMount() {
    for (let i = 0; i < data.length; i++) {
      this.setState((prevState) => ({
        ciudades: [...prevState.ciudades, data[i]["CIUDAD"]],
        servicios: [
          ...prevState.servicios,
          {
            CIUDAD: data[i]["CIUDAD"],
            "CAMAS HOSPITALARIAS": data[i]["CAMAS HOSPITALARIAS"],
            CHILEXPRESS: data[i]["CHILEXPRESS"],
            INDAP: data[i]["INDAP"],
            SAG: data[i]["SAG"],
            CAPREDENA: data[i]["CAPREDENA"],
          },
        ],
      }));
    }
    // Cargar múltiples archivos Excel
    this.cargarArchivoExcel("data/Indice_por_dimension.ods", "indiceDimension");
    this.cargarArchivoExcel("data/indice_provision_por_ciudad.ods","indiceProvisionCiudad");
    this.cargarArchivoExcel("data/Rango_para_cada_indicador.ods","rangosIndicadores");
    this.cargarArchivoExcel("data/Rangos_dimensiones.ods", "rangosDimensiones");
    this.cargarArchivoExcel("data/Rangos_indice_provision.ods","rangosIndiceProvision");
    this.cargarArchivoExcel("data/Valor_por_ciudad_indicador.ods","valorPorCIudadIndicador");

  }

  //https://www.npmjs.com/package/multiselect-react-dropdown

  render() {
    return (
      <div className="superPosition-dashboard">
        <main>
          <Container className="my-0 p-3 background-back-dashboard">
            <AnalisisTerritorio></AnalisisTerritorio>
            <AnalisisComparativo
              ciudades={this.state.ciudades}
              servicios={this.state.servicios}
            ></AnalisisComparativo>
          </Container>
        </main>
      </div>
    );
  }
}



/*<Form.Select aria-label="Default select">
                    <option>Dimensión / Servicios</option>
                    {this.state.nombreIndicadores
                      .reduce((resultado, objeto) => {
                        const nombreDimension = objeto["Dimensión"];
                        if (!resultado.includes(nombreDimension)) {
                          resultado.push(nombreDimension);
                        }
                        return resultado;
                      }, [])
                      .map((nombreIndicador) => {
                        return (
                          <option key={nombreIndicador}>
                            {nombreIndicador}
                          </option>
                        );
                      })}
                  </Form.Select>*/