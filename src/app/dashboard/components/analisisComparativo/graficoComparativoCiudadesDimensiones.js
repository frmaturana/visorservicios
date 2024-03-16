import React from "react";
import ReactApexChart from "react-apexcharts";

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

export default class GradicoComparativoCiudadesDimensiones extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rangos: this.props.rangos,
      options: {
        chart: {
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          heatmap: {
            distributed: true,
            enableShades: false,
            colorScale: {
              ranges: [
                {
                  from: 1,
                  to: 2,
                  color: "#fa5f49",
                  name: "Rango 1",
                },
                {
                  from: 3,
                  to: 4,
                  color: "#f9a59a",
                  name: "Rango 2",
                },
                {
                  from: 5,
                  to: 6,
                  color: "#f9d99a",
                  name: "Rango 3",
                },
                {
                  from: 7,
                  to: 8,
                  color: "#add5fa",
                  name: "Rango 4",
                },
                {
                  from: 9,
                  to: 10,
                  color: "#95b8f6",
                  name: "Rango 5",
                },
                {
                  from: 11,
                  to: Infinity, // Establece el último rango como infinito
                  color: "#005cfa",
                  name: "Rango 6",
                },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        /*title: {
          text: 'Ciudades,
          show: false
        },*/
        xaxis: {
          type: "category",
          categories: props.listaDeServiciosAMostrar.map(
            (servicios) => servicios["Indicador o variable"]
          ),
        },
        tooltip: {
          custom: function ({seriesIndex, dataPointIndex, w}) {
            // `seriesIndex` te dará el índice de la serie actual
            // `dataPointIndex` te dará el índice del punto de datos actual
            // `w.config.series[seriesIndex].data[dataPointIndex]` te dará acceso a los datos específicos en ese punto

            // Aquí puedes construir tu propio contenido personalizado para el tooltip

            const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
            const customTooltipContent = `
            <div>
             Serie: ${w.config.series[seriesIndex].name}
            </div>
           <div>
              Valor: ${w.config.series[seriesIndex].data[dataPointIndex].valor}
            </div>
           `;

            return customTooltipContent;
          },
        },
      },
      series: this.generateData(props),
    };
  }

  generateData = (props) => {
    const data = [];
    const cities = [];

    for (let i = 0; i < props.ciudades.length; i++) {
      cities.push(props.ciudades[i]);
    }

    for (let i = 0; i < cities.length; i++) {
      const cityData = [];
      const valorRango = [];
      for (let j = 0; j < props.listaDeServiciosAMostrar.length; j++) {
        let ciudadEncontrada = props.servicios.find((ciudad) =>
          quitarTildes(ciudad["Entidad urbana"].toUpperCase()).includes(
            quitarTildes(cities[i].urbano.toUpperCase())
          )
        );

        if (!ciudadEncontrada) {
          ciudadEncontrada = props.servicios.find((ciudad) =>
            quitarTildes(ciudad["Entidad urbana"].toUpperCase()).includes(
              quitarTildes(cities[i].nombreComuna.toUpperCase())
            )
          );
        }

        if (!ciudadEncontrada) {
          ciudadEncontrada = props.servicios.find((ciudad) =>
            quitarTildes(cities[i].urbano.toUpperCase()).includes(
              quitarTildes(ciudad["Entidad urbana"].toUpperCase())
            )
          );
        }

        const valor =
          ciudadEncontrada[props.listaDeServiciosAMostrar[j]["Codificación"]];

        const rangoRegion = this.state.rangos.find(
          (rango) =>
            rango.variable ===
              props.listaDeServiciosAMostrar[j]["Codificación"] &&
            quitarTildes(cities[i].nombreRegion).includes(
              rango.Region.toUpperCase()
            )
        );

        var rango = 1;

        if (rangoRegion) {
          if (valor >= rangoRegion["Bajo"]) {
            rango = 1;
          }
          if (valor >= rangoRegion["Termina_rang1_Empie_rang2"]) {
            rango = 3;
          }
          if (valor >= rangoRegion["Termina_rang2_Empie_rang3"]) {
            rango = 5;
          }
          if (valor >= rangoRegion["Termina_rang3_Empie_rang4"]) {
            rango = 7;
          }
          if (valor >= rangoRegion["Termina_rang4_Empie_rang5"]) {
            rango = 9;
          }
          if (valor >= rangoRegion["Alto"]) {
            rango = 11;
          }
        }

        valorRango.push(rango);
        cityData.push({x: cities[i].urbano, y:rango, valor:valor});

      }
      data.push({
        name: cities[i].urbano,
        data: cityData,
      });
    }

    return data;
  };

  establecerNuevoGrafico() {
    const servicios = this.props.listaDeServiciosAMostrar.map((servicio) => servicio["Codificación"])

    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: this.props.listaDeServiciosAMostrar.map(
            (servicios) => servicios["Indicador o variable"]
          ),
        },
      },
    }));
    this.setState((prevState) => ({
      series: this.generateData(this.props),
    }));
  }

  establecerCiudades() {
    this.setState((prevState) => ({
      series: this.generateData(this.props),
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.listaDeServiciosAMostrar !== prevProps.listaDeServiciosAMostrar
    ) {
      this.establecerNuevoGrafico();
    }
    if (this.props.ciudades !== prevProps.ciudades) {
      this.establecerCiudades();
    }
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="heatmap"
          height={350}
        />
      </div>
    );
  }
}
