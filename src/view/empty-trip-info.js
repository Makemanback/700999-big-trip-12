import {createElement} from "../utils.js";

const createEmptyTripInfo = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
      </p>
    </section>`
  );
};

export default class EmptyTripInfo {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyTripInfo();
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
