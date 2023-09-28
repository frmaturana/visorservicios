"use client";
import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import "./headFuction.css";

export default function HeadFuction() {
  return (
    <div className="headFuction pt-0 pb-5">
      <Container className="mb-5">
        <Row className="justify-content-center pt-1">
          <Col className="text-center">
            <img src="./logo-proyecto.svg" alt="FONDECYT 1230159" />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <h4 className="text-center">
            Modelación prospectiva de los servicios básicos en asentamientos
            humanos del Sur de Chile. Propuestas para su gestión territorial
          </h4>
          <div>
          <Row className="justify-content-between text-center">
            <Col sm={4}></Col>
            <Col sm={4}>
              <h3 className="d-inline-block" >FONDECYT 1230159</h3>
            </Col>
            <Col sm={4} >
              <Button className="color-primario w-50 mb-3" href="http://fmaturana.cl/Fondecyt_1230159/">
                
                Ir web proyecto
              </Button>
            </Col>
            </Row>
          </div>
          <hr style={{ color: "white" }} />
          <h2 className="text-center">
            {" "}
            Visor de provisión de servicios básicos
          </h2>
        </Row>
      </Container>
    </div>
  );
}
