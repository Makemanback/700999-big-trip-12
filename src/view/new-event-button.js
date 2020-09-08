import AbstractView from './abstract.js';

const createNewEventButtonTemplate = () => `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;

export default class EventButton extends AbstractView {

  getTemplate() {
    return createNewEventButtonTemplate();
  }
}
