import AbstractView from "./abstract.js";

export default class TripDaysList extends AbstractView {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
