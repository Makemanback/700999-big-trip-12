import AbstractView from "./abstract.js";
import {StatsType} from '../const.js';

const createStatsItem = (type) => {
  return type.map((statsType) => {
    return (
      `<div class="statistics__item statistics__item--${statsType}">
        <canvas class="statistics__chart  statistics__chart--${statsType}" width="900"></canvas>
      </div>`
    );
  }).join(``);
};

const createStatisticsTemplate = () => {

  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

        ${createStatsItem(Object.values(StatsType))}

    </section>`
  );
};

export default class Stats extends AbstractView {

  getTemplate() {
    return createStatisticsTemplate();
  }
}
