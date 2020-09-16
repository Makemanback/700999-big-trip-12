import SmartView from "./smart.js";
import {Time} from '../const.js';

export const createAdditionals = (arr) => {
  return arr
  .slice(0, 3)
  .map(({title, price}) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  }).join(``);

};

export const getTimeGap = (start, end) => {
  const gapDays = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES / Time.HOURS);
  const gapHours = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);
  const gapMinutes = Math.floor(((end - start) / Time.MILLISECONDS / Time.SECONDS % Time.MINUTES));
  if (gapMinutes === 0) {
    return `${gapHours}H`;
  }

  if (gapHours >= Time.HOURS) {
    return `${gapDays}D ${gapHours % Time.HOURS}H ${Math.round(gapMinutes)}M`;
  } else {
    return `${gapHours}H ${Math.round(gapMinutes)}M`;
  }

};

const createTripPointTemplate = ({type, price, additionals, schedule, destination}) => {
  const {name} = destination;

  const {start, end} = schedule;
  const formatDate = (day) => day.toLocaleString(`ru-RU`, {hour: `numeric`, minute: `numeric`});
  return (
    `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
          </div>
          <h3 class="event__title">${type} to ${name}</h3>

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
      </li>`
  );
};

export default class TripPoint extends SmartView {
  constructor(point) {
    super();
    this._data = TripPoint.parseDataToPoint(point);

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createTripPointTemplate(this._data);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  static parseDataToPoint(point) {
    return Object.assign(
        {},
        point,
        {
          type: point.type,
          additionals: point.additionals,
          // name: point.destination.name,
          price: point.price,
          schedule: point.schedule,

          destination: point.destination,


        }
    );
  }

}
