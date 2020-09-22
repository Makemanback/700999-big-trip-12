import AbstractView from './abstract.js';

export default class EventButton extends AbstractView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();

    this._callback.buttonClick(evt.target.id);
    this._disable();
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;

    this.getElement().addEventListener(`click`, this._buttonClickHandler);
  }

  _disable() {
    this.getElement().disabled = true;
  }
}
