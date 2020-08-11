import {formatDate} from '../utils.js';

const createDays = (obj, index) => {
  return (
    `
      <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${formatDate(obj)}">${obj.toLocaleString(`en-US`, {month: `short`, day: `numeric`})}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export const createTripDayTemplate = (point, index) => {
  return createDays(point, index);
};
