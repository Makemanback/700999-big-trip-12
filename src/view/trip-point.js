import {createElement} from '../utils.js';
import {Time} from '../mock/trip-day.js';

export const createAdditionals = (arr) => {
  return arr
  .slice(0, 3)
  .map((item) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${item.offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${item.cost}</span>
      </li>`
    );
  }).join(``);

};

const getTimeGap = (start, end) => {
  const gap = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);
  const gapMinutes = Math.floor(((end - start) / Time.MILLISECONDS / Time.SECONDS % Time.MINUTES));

  if (gapMinutes === 0) {

    return `${gap}H`;
  }
  return `${gap}H ${Math.round(gapMinutes)}M`;
};

export const createTripPointTemplate = (point) => {
  const {type, city, price, additionals} = point;
  const {start, end} = point.schedule;
  const formatDate = (day) => day.toLocaleString(`ru-RU`, {hour: `numeric`, minute: `numeric`});

  return (
    `
    <li class="trip-days__item  day">

      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} to ${city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${start}">${formatDate(start)}</time>
              &mdash;
              <time class="event__end-time" datetime="${end}">${formatDate(end)}</time>
            </p>
            <p class="event__duration">${getTimeGap(start, end)}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">


          ${createAdditionals(additionals)}

          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>

  </li>`
  );
};

export default class TripPoint {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
