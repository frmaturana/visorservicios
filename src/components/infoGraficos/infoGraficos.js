import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
//import Grafico from "./grafico";
import dynamic from "next/dynamic";

import "./infoGraficos.css";

const Grafico = dynamic(() => import("./grafico"), { ssr: false });

export default class InfoGraficos extends React.Component {
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
      listaDeServiciosAMostrar : [
        "CAMAS HOSPITALARIAS",
        "CHILEXPRESS",
        "INDAP",
        "SAG",
        "CAPREDENA",
      ],
      listaComunas: ["CUNCO", "CARAHUE", "LOS SAUCES", "VALDIVIA", "LOS LAGOS", "LA UNION"],
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
      <Container
        style={{
          zIndex: 2,
          maxWidth: "100%",
          paddingRight: "15px",
        }}
      >
        <Row className="info-container">
          <Col xl={{ span: 4, offset: 8 }} className="info">
            <h2 className="text-center">Visor de servicios</h2>

            <h4 className="mt-2">Región</h4>
            <Form.Select
              aria-label="Default select Región"
              onChange={(e) => {
                this.seleccionarComunasRegion(e.target.value);
              }}
            >
              <option value="0">Región</option>
              <option value="2">Los Ríos</option>
              <option value="3">Araucanía</option>
            </Form.Select>

            <h4 className="mt-2">Dimensión</h4>
            <Form.Select
              aria-label="Default select dimensión"
              onChange={(e) => {
                this.seleccionarDimension(e.target.value);
              }}
            >
              <option value="0">Todas las dimensiones</option>
              <option value="1">Económica</option>
              <option value="2">Social</option>
              <option value="3">Infrastructura</option>
            </Form.Select>

            <div className="m-2 filtro-servicios">
              {this.state.listaDeServiciosAMostrar.map((servicio) => {
                return (
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    id={servicio}
                    key={servicio}
                    label={servicio}
                    className="mx-2"
                    checked={this.state.listaDeServicios.includes(servicio)}
                    onChange={(e) => {
                      // e.target.checked will return true or false if checkbox is checked
                      e.target.checked
                        ? this.agregarServiciosAlistaDeServicios(servicio)
                        : this.eliminarServiciosAlistaDeServicios(servicio);
                    }}
                  />
                );
              })}
            </div>
            <Grafico
              ciudades={this.state.listaComunas}
              servicios={this.props.servicios}
              listaDeServiciosAMostrar={this.state.listaDeServicios}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
