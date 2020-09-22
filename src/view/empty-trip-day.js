import AbstractView from "./abstract.js";

const createDay = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};


export default class EmptyTripDay extends AbstractView {
  getTemplate() {
    return createDay();
  }
}
