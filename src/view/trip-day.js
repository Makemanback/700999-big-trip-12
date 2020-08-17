import AbstractView from "./abstract.js";
import {formatDate} from '../utils/date.js';

const createDays = (dates, index) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${formatDate(dates)}">${dates.toLocaleString(`en-US`, {month: `short`, day: `numeric`})}</time>
      </div>
    </li>`
  );
};

export const createTripDayTemplate = (point, index) => createDays(point, index);

export default class TripDay extends AbstractView {
  constructor(item, index) {
    super();
    this._item = item;
    this._index = index;
  }

  getTemplate() {
    return createDays(this._item, this._index);
  }
}
