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
  const gap = Math.floor((end - start) / 1000 / 60 / 60);
  const gapMin = ((end - start) / 1000 / 60 % 60);

  if (gapMin === 0) {
    return `${gap}H`;
  }
  return `${gap}H ${Math.round(gapMin)}M`;
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

