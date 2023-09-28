import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./footerFuction.css";

export default function FooterFunction() {
  return (
    <div className="footerFunction pb-2">
      <div className="super-footer-position pt-4">
        <Container className="my-1">
          <Row className="justify-content-between">
            <Col className="pt-4">
              <h5 className="text-center">
                Financia Agencia Nacional de Investigación y Desarrollo, ANID /
                Fondecyt Regular
              </h5>
              <img
                src="./fond.png"
                alt="Agencia Nacional de Investigación y Desarrollo"
                className="mx-auto d-block"
              />
            </Col>
            <Col className="py-4 ">
              <h5 className="text-center">
                Universidad Patrocinante investigador principal
              </h5>
              
              <img
                src="./uach.png"
                alt="UACh"
                className="mx-auto my-5 d-block"
                style={{ maxWidth: "420px" }}
              />
              <h6 className="text-center">
                Universidades Patrocinantes co investigadores
              </h6>
              <Row className="justify-content-between">
                <Col style={{ maxHeight: "320px", maxWidth: "33%" }}>
                  <img
                    src="./logo_PUC.svg"
                    alt="PUC"
                    className="mx-auto my-4 d-block"
                    style={{ maxWidth: "39%" }}
                  />
                </Col>
                <Col style={{ maxHeight: "320px", maxWidth: "33%" }}>
                  <img
                    src="./logo_UAH_2.svg"
                    alt="UAH"
                    className="mx-auto my-5 d-block"
                    style={{ maxWidth: "100%" }}
                  />
                </Col>
                <Col style={{ maxHeight: "320px", maxWidth: "33%" }}>
                  <img
                    src="./logo_UCT.svg"
                    alt="UCT"
                    className="mx-auto my-5 d-block"
                    style={{ maxWidth: "100%" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="pt-5">
            
            <p className="text-center">
              Desarrollado por Sebastián Andres Durán Vilches - Septiembre 2023
            </p>
            <p className="text-center">Consultas o reporte de un error por favor contactar a Dr. Francisco Maturana Investigador Responsable
del proyecto a francisco.maturana@uach.cl</p>
          </Row>
        </Container>
      </div>
    </div>
  );
}
