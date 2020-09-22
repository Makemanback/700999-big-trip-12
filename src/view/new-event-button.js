import AbstractView from './abstract.js';

export default class EventButton extends AbstractView {
  getTemplate() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
  }
}
