import React, { useEffect } from 'react';
import ReactApexChart from "react-apexcharts";

export default class RadarChartAnalisis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "radar-chart",
        },
        /*title: {
              text: 'Gráfico de Radar con 7 Dimensiones', // Título del gráfico
              style: {
                fontFamily: 'Open Sans',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '32px',
              },
            },*/
            xaxis: {
                categories: ['Dimensión 1', 'Dimensión 2', 'Dimensión 3', 'Dimensión 4', 'Dimensión 5', 'Dimensión 6', 'Dimensión 7'],
                labels: {
                  show: true,
                  style: {
                    colors: ['#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057','#495057'], // Color del texto de las etiquetas
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    fontWeight: 600,
                  },
                },
              },
            yaxis: {
                show: false,
            },
        fill: {
          opacity: 0.26,
          colors: ["#81ACAA4A"], // Color del área con transparencia
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["#634F4E"],
          ashArray: 0,
        },
        markers: {
            size: 0,
            hover: {
              size: 1
            }
          },
          dataLabels: {
            enabled: true,
            background: {
              enabled: true,
              borderRadius:2,
            },
            style: {
                colors: ['#634F4E'], // Color del texto de las etiquetas
              },
          },
        plotOptions: {
            radar: {
              polygons: {
                opacity: 1,
                strokeColor: '#B2B9C0',
                fill: {
                    colors: ['#f8f8f8', '#fff']
                }
              }
            }
        },
      },
      series: [
        {
          name: "Área única",
          data: [80, 60, 70, 90, 50, 75, 65], // Valores para las 7 dimensiones
        },
      ],
    };
  }

  render() {
    return (
      <div className="radar-chart text-center">
        <h5 className='titulo-grafico-radar py-1'>
          Gráfico de Radar con 7 Dimensiones
        </h5>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radar"
          height="300"
        />
      </div>
    );
  }
}
