import AbstractView from "./abstract.js";

const createDay = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};


export default class TripDay extends AbstractView {
  getTemplate() {
    return createDay();
  }

  clearContent() {
    this.getElement().querySelector(`.trip-events__list`).innerHTML = ``;
  }
}
