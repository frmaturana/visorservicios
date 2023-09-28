import React from "react";
import Card from "react-bootstrap/Card";
import "./analisisTerritorio.css";

export default class ValoresAnalisis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valor: 0,
      maximo: 0,
      minimo: 0,
      mediana: 0,
      promedio: 0,
      rangos: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.valor !== prevProps.valor ||
      this.props.maximo !== prevProps.maximo ||
      this.props.minimo !== prevProps.minimo ||
      this.props.mediana !== prevProps.mediana ||
      this.props.promedio !== prevProps.promedio ||
      this.props.rangos !== prevProps.rangos
    ) {
      this.setState({
        valor: this.props.valor,
        maximo: this.props.maximo,
        minimo: this.props.minimo,
        mediana: this.props.mediana,
        promedio: this.props.promedio,
        rangos: this.props.rangos,
      });
    }
  }

  render() {
    return (
      <div>
        <h3 className="titulos-dashboard text-center pt-3">
        Valor de entidad urbana
        </h3>
        <div className="d-flex justify-content-between flex-wrap p-1 text-center">
          <Card className="mb-2" style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>Valor</Card.Title>
              <Card.Text>{this.state.valor.toFixed(4)}</Card.Text>
            </Card.Body>
          </Card>
          <h4 className="titulos-dashboard text-center py-2">
          Valor de la distribución de los datos
        </h4>
          <div
            className="d-flex justify-content-between flex-wrap"
            style={{ width: "100%" }}
          >
            <Card className="mb-2" style={{ width: "49%" }}>
              <Card.Body>
                <Card.Title>Mínimo</Card.Title>
                <Card.Text>{this.state.minimo.toFixed(4)}</Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-2" style={{ width: "49%" }}>
              <Card.Body>
                <Card.Title>Máximo</Card.Title>
                <Card.Text>{this.state.maximo.toFixed(4)}</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ width: "49%" }}>
              <Card.Body>
                <Card.Title>Mediana</Card.Title>
                <Card.Text>{this.state.mediana.toFixed(4)}</Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ width: "49%" }}>
              <Card.Body>
                <Card.Title>Promedio</Card.Title>
                <Card.Text>{this.state.promedio.toFixed(4)}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <Card className="mb-2 mt-2" style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>Leyenda</Card.Title>
              <div className="leyenda-container-ciudad justify-content-center">
                <div className="leyenda-item-ciudad">
                  <div className="color bajo-ciudad"></div>
                  <p style={{ width: "33px" }}>Bajo</p>
                </div>
                <div className="leyenda-item-ciudad">
                  <div className="color medio-bajo-ciudad"></div>
                  {/*<p>Medio-Bajo</p>*/}
                </div>
                <div className="leyenda-item-ciudad">
                  <div className="color medio-ciudad"></div>
                  {/*<p>Medio</p>*/}
                </div>
                <div className="leyenda-item-ciudad">
                  <div className="color medio-alto-ciudad"></div>
                  {/*<p>Medio-Alto</p>*/}
                </div>
                <div className="leyenda-item-ciudad">
                  <div className="color casi-alto-ciudad"></div>
                  {/*<p>Medio-Alto</p>*/}
                </div>
                <div className="leyenda-item-ciudad">
                  <div className="color alto-ciudad"></div>
                  <p style={{ width: "30px" }}>Alto</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
