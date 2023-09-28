import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./dashboardFunction.css";
import AnalisisTerritorio from "../analisisTerritorio/analisisTerritorio";
import AnalisisComparativo from "../analisisComparativo/analisisComparativo";
import data from "../../../datosTest.json";
import XLSX from "xlsx";

export default class DashboardFunction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      indiceDimension: [],
      indiceProvisionCiudad: [],
      rangosIndicadores: [],
      rangosDimensiones: [],
      rangosIndiceProvision: [],
      valorPorCiudadIndicador: [],
      nombreIndicadores: [],
      loading: true, // Agregamos una bandera de carga
    };
  }

  // Función para cargar un archivo Excel
  cargarArchivoExcel = async (ruta, estadoVariable) => {
    try {
      const response = await fetch(ruta);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const primeraHoja = workbook.Sheets[workbook.SheetNames[0]];
      const datos = XLSX.utils.sheet_to_json(primeraHoja);

      // Actualiza la variable de estado correspondiente
      this.setState((prevState) => ({
        prevState,
        [estadoVariable]: datos,
        loading: false, // Establece la bandera de carga en falso cuando se completa la carga
      }));
    } catch (error) {
      console.error("Error al cargar el archivo .ods", error);
    }
  };

  async componentDidMount() {
    // Cargar múltiples archivos Excel en paralelo
    const promises = [
      this.cargarArchivoExcel(
        "data/Indice_por_dimension.ods",
        "indiceDimension"
      ),
      this.cargarArchivoExcel(
        "data/indice_provision_por_ciudad.ods",
        "indiceProvisionCiudad"
      ),
      this.cargarArchivoExcel(
        "data/Rango_para_cada_indicador.ods",
        "rangosIndicadores"
      ),
      this.cargarArchivoExcel(
        "data/Rangos_dimensiones.ods",
        "rangosDimensiones"
      ),
      this.cargarArchivoExcel(
        "data/Rangos_indice_provision.ods",
        "rangosIndiceProvision"
      ),
      this.cargarArchivoExcel(
        "data/Valor_por_ciudad_indicador.ods",
        "valorPorCiudadIndicador"
      ),
      this.cargarArchivoExcel(
        "data/nombreIndicadores.ods",
        "nombreIndicadores"
      ),
    ];

    try {
      // Espera a que todas las promesas se completen antes de continuar
      await Promise.all(promises);
    } catch (error) {
      console.error("Error al cargar uno o más archivos .ods", error);
    }
  }

  render() {
    // Verifica si los datos se han cargado antes de renderizar
    if (this.state.loading) {
      return (
        <div className="superPosition-dashboard">
          <main>
            <Container className="my-0 p-3 background-back-dashboard">
              <h1 style={{ color: "black" }}>Cargando ...</h1>
            </Container>
          </main>
        </div>
      );
    }

    return (
      <div className="superPosition-dashboard">
        <main>
          <Container className="my-0 p-3 background-back-dashboard">
            <AnalisisTerritorio
              indiceDimension={this.state.indiceDimension}
              indiceProvisionCiudad={this.state.indiceProvisionCiudad}
              rangosIndicadores={this.state.rangosIndicadores}
              rangosDimensiones={this.state.rangosDimensiones}
              rangosIndiceProvision={this.state.rangosIndiceProvision}
              valorPorCiudadIndicador={this.state.valorPorCiudadIndicador}
              nombreIndicadores={this.state.nombreIndicadores}
            ></AnalisisTerritorio>
            <AnalisisComparativo
              indiceDimension={this.state.indiceDimension}
              indiceProvisionCiudad={this.state.indiceProvisionCiudad}
              rangosIndicadores={this.state.rangosIndicadores}
              rangosDimensiones={this.state.rangosDimensiones}
              rangosIndiceProvision={this.state.rangosIndiceProvision}
              valorPorCiudadIndicador={this.state.valorPorCiudadIndicador}
              nombreIndicadores={this.state.nombreIndicadores}
            ></AnalisisComparativo>
          </Container>
        </main>
      </div>
    );
  }
}
