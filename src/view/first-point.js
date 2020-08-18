import {createElement} from '../utils.js';

const createFirstPointTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};


export default class firstPoint {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFirstPointTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
