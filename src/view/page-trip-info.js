import AbstractView from "./abstract.js";

const createPageInfoCostTemplate = (price) => {
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`
  );
};

const createPageInfoTemplate = (cities, startDate, endDate) => {
  const trip = cities.length > 3 ? `${cities[0]}  — ... —  ${cities[cities.length - 1]}` : cities.join(` — `);

  return (
    `<div class="trip-info__main">
    <h1 class="trip-info__title">${trip}</h1>
    <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
  </div>`
  );
};


const createPageTripInfoTemplate = (cities, startDate, endDate, price) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
    ${createPageInfoTemplate(cities, startDate, endDate)}
    ${createPageInfoCostTemplate(price)}
    </section>`
  );
};

export default class PageTripInfo extends AbstractView {
  constructor(cities, startDate, endDate, price) {
    super();
    this._cities = cities;
    this._startDate = startDate;
    this._endDate = endDate;
    this._price = price;
  }

  getTemplate() {
    return createPageTripInfoTemplate(this._cities, this._startDate, this._endDate, this._price);
  }
}
