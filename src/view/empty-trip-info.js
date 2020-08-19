import AbstractView from "./abstract.js";

const createEmptyTripInfo = () => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
      </p>
    </section>`
  );
};

export default class EmptyTripInfo extends AbstractView {
  getTemplate() {
    return createEmptyTripInfo();
  }
}
