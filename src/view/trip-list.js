import AbstractView from "./abstract.js";

export default class TripList extends AbstractView {

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }

  clearContent() {
    this.getElement().innerHTML = ``;
  }
}
