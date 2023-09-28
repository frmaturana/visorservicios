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

export default class GraficoComparativoUnServicio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            {
              x: "New Delhi",
              y: 218,
            },
            {
              x: "Kolkata",
              y: 149,
            },
            {
              x: "Mumbai",
              y: 184,
            },
            {
              x: "Ahmedabad",
              y: 55,
            },
            {
              x: "Bangaluru",
              y: 84,
            },
            {
              x: "Pune",
              y: 31,
            },
            {
              x: "Chennai",
              y: 70,
            },
            {
              x: "Jaipur",
              y: 30,
            },
            {
              x: "Surat",
              y: 44,
            },
            {
              x: "Hyderabad",
              y: 68,
            },
            {
              x: "Lucknow",
              y: 28,
            },
            {
              x: "Indore",
              y: 19,
            },
            {
              x: "Kanpur",
              y: 29,
            },
          ],
        },
      ],
      options: {
        legend: {
          show: false,
        },
        chart: {
          height: 350,
          type: "treemap",
        },
        title: {
          text: this.props.servicio["nombre"],
          align: "center",
        },
        colors: [
          "#3B93A5",
          "#F7B844",
          "#ADD8C7",
          "#EC3C65",
          "#CDD7B6",
          "#C1F666",
          "#D43F97",
          "#1E5D8C",
          "#421243",
          "#7F94B0",
          "#EF6537",
          "#C0ADDB",
        ],
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false,
          },
        },
        export: {
          title: {
            text: "Descargar Gráfica Personalizada", // Personaliza el título del botón de descarga
          },
        },
      },
    };
  }

  establecerNuevoGrafico(props) {
    const datos = [];
    const cities = [];

    for (let i = 0; i < props.ciudades.length; i++) {
      cities.push(props.ciudades[i]);
    }

    for (let i = 0; i < cities.length; i++) {
      if (cities[i].comuna) {
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

        if (!props.servicio) return 0;

        const cityData = ciudadEncontrada[props.servicio["Codificación"]];
        datos.push({ x: cities[i].urbano, y: cityData });
      }
    }
    // Modifica la serie de datos según tus necesidades
    const nuevaSerie = [
      {
        data: datos,
      },
    ];
    // Actualiza el estado con la nueva serie
    this.setState({ series: nuevaSerie });
  }

  componentDidUpdate(prevProps, prevState) {
     if (this.props !== prevProps) {
      if(this.props.servicio["nombre"] && this.props.servicio["nombre"] != "Seleccione un servicio"){ 
        this.establecerNuevoGrafico(this.props);
      }

      const options = {
        legend: {
          show: false,
        },
        chart: {
          height: 350,
          type: "treemap",
        },
        title: {
          text: this.props.servicio["nombre"],
          align: "center",
        },
        colors: [
          "#3B93A5",
          "#F7B844",
          "#ADD8C7",
          "#EC3C65",
          "#CDD7B6",
          "#C1F666",
          "#D43F97",
          "#1E5D8C",
          "#421243",
          "#7F94B0",
          "#EF6537",
          "#C0ADDB",
        ],
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false,
          },
        },
      }

      this.setState({
        options: options,
      });
    }
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="treemap"
          height={350}
        />
      </div>
    );
  }
}
