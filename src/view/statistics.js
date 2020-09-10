import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {StatsType} from '../const.js';
import {createUniqeTypes, getPointsArray, getPointByTypePrice, createTravelTypes, getUniqueMeanings, countTravelType, countTimeSpend, getPointsTitles, createAllTypes, getPointByTypeDuration} from '../utils/statistics.js';

const renderMoneyChart = (moneyCtx, points) => {
  const uniqueTypes = createUniqeTypes(points);
  const typesPrices = getPointByTypePrice(points);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypes,
      datasets: [{
        data: typesPrices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#158deb`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {

  const uniqueTravelTypes = getUniqueMeanings(createTravelTypes(points));

  const countedTypes = countTravelType(points);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTravelTypes,
      datasets: [{
        data: countedTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#158deb`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderSpendChart = (timeSpendCtx, points) => {


// console.log(getPointByTypeDuration(points))
countTimeSpend(points)
  const allPoints = createAllTypes(points);
  const uniquePoints = getUniqueMeanings(allPoints);
  return new Chart(timeSpendCtx, {

    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniquePoints,
      datasets: [{
        data: [4, 3, 2, 1],
        // data: duration,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = ({MONEY, TRANSPORT, TIME_SPEND}) => {

  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--${MONEY}">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--${TRANSPORT}">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--${TIME_SPEND}">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class Stats extends SmartView {
  constructor(points) {
    super();

    this._data = {
      points
    };

    this._moneyCart = null;
    this._transportCart = null;
    this._spendCart = null;

    this._setCharts();
  }

  getTemplate() {

    return createStatisticsTemplate(this._data, StatsType);
  }

  _setCharts() {
    if (this._moneyCart !== null || this._transportCart !== null || this._spendCart !== null) {
      this._moneyCart = null;
      this._transportCart = null;
      this._spendCart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;

    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    this._moneyCart = renderMoneyChart(moneyCtx, this._data);
    this._transportCart = renderTransportChart(transportCtx, this._data);
    this._spendCart = renderSpendChart(timeSpendCtx, this._data);
  }
}
