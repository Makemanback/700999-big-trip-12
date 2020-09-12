import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {getPointByTypePrice, getTravelTypeByRepeats, countTimeSpend} from '../utils/statistics.js';
import {Stat} from '../const.js';

const renderMoneyChart = (moneyCtx, points) => {

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(points),
      datasets: [{
        data: Object.values(points),
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

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(points),
      datasets: [{
        data: Object.values(points),
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
  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(points),
      datasets: [{
        data: Object.values(points),
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
          formatter: (duration) => duration > 24 ? `${Math.floor(duration / 24)}D ${Math.floor(duration % 24)}H` : `${duration}H`
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

    this._data = points;

    this._moneyCart = null;
    this._transportCart = null;
    this._spendCart = null;

    this._setCharts();
  }

  getTemplate() {

    return createStatisticsTemplate(this._data);
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


    moneyCtx.height = Stat.BAR_HEIGHT * 6;
    transportCtx.height = Stat.BAR_HEIGHT * 4;
    timeSpendCtx.height = Stat.BAR_HEIGHT * 4;

    this._moneyCart = renderMoneyChart(moneyCtx, getPointByTypePrice(this._data));
    this._transportCart = renderTransportChart(transportCtx, getTravelTypeByRepeats(this._data));
    this._spendCart = renderSpendChart(timeSpendCtx, countTimeSpend(this._data));
  }
}
