import React from "react";
import { useState } from "react";
import "./menu.css";
import { Nav, Button, Container } from "react-bootstrap";
import ExcelJS from "exceljs";


export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuDetails: true,
    };
    this.descargarExcel = this.descargarExcel.bind(this);
  }

  descargarExcel = async () => {
    const { data } = this.props;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Agregar encabezados
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Agregar filas de datos
    data.forEach(item => {
      worksheet.addRow(Object.values(item));
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datos.xlsx";
    link.click();
  };

  redirigirAExterna = () => {
    window.location.href = "https://www.google.com";
  };


  render() {
    return (
      <Nav
        defaultActiveKey="/home"
        className={
          this.state.menuDetails
            ? "navbarVisuality-details flex-column"
            : "navbarVisuality flex-column"
        }
        style={{ position: "fixed", zIndex: 3, background: "white" }}
      >
        <Nav.Link className="icons-navbar mt-3 p-2 logo" eventKey="link-0">
          <img src="./favicon.ico" alt="CORE App" className="mx-auto d-block" />
        </Nav.Link>
        <Nav.Link
          className="my-2 icons-navbar mt-5"
          alt="Todos"
          eventKey="link-0"
        >
          <Button className="btn-dark" onClick={this.descargarExcel}>
            <div>
              <h5>Descargar datos</h5>
            </div>
            <div>
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Interface / Download">
                  <path
                    id="Vector"
                    d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </Button>
        </Nav.Link>

        <Nav.Link className=" icons-navbar mt-1" alt="Todos" eventKey="link-0">
          <Button className="btn-info" onClick={this.redirigirAExterna}> 
            <div>
              <h5>Más información</h5>
            </div>
            <div>
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Warning / Info">
                  <path
                    id="Vector"
                    d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </Button>
        </Nav.Link>

        <Nav.Link
          className="m-2 my-3 icons-navbar fixed-bottom"
          onClick={() => {
            this.setState({ menuDetails: !this.state.menuDetails });
          }}
          style={{ maxWidth: "100%", position: "absolute" }}
        >
          {this.state.menuDetails ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-chevron-double-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
              <path
                fillRule="evenodd"
                d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-chevron-double-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
              />
              <path
                fillRule="evenodd"
                d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          )}
        </Nav.Link>
      </Nav>
    );
  }
}
