/*
import SmartView from "./smart.js";
import {createAdditionals, createDescription, createCities, createTypeItemsTemplate} from './trip-edit.js';
import {Type, CITIES, getAdditionalsByType, generateRandomDescription, getRandomSchedule} from '../mock/trip-day.js';
import flatpickr from "flatpickr";


const createNewPointTemplate = (BLANK_POINT) => {
  const {additionals, pointInfo, price, type, city, start, end} = BLANK_POINT;
  const {description, photo} = pointInfo;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            ${createTypeItemsTemplate(Object.values(Type).slice(0, 7))}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${createTypeItemsTemplate(Object.values(Type).slice(7, 10))}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createCities(CITIES)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createAdditionals(additionals)}
        </div>
      </section>

          ${createDescription(city, description, photo)}
    </section>
  </form>`
  );
};


export default class NewPoint extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = NewPoint.parseDataToPoint(point);
    this._datepicker = null;

    // this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._eventDestinationHandler = this._eventDestinationHandler.bind(this);
    this._eventPriceHandler = this._eventPriceHandler.bind(this);
    this._eventDurationStartHandler = this._eventDurationStartHandler.bind(this);
    this._eventDurationEndHandler = this._eventDurationEndHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createNewPointTemplate(this._data);
  }

  _eventTypeHandler(evt) {
    const type = evt.target.innerText;
    this.updateData({
      type: evt.target.innerText,
      additionals: getAdditionalsByType(type),
    });
  }

  _setDatepicker() {

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.schedule.start) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-start-time-1`),
          {
            dateFormat: `y/m/d H:i`,
            enableTime: true,
            defaultDate: this._data.schedule.start,
            onChange: this._eventDurationStartHandler
          }
      );
    }

    if (this._data.schedule.end) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-end-time-1`),
          {
            dateFormat: `y/m/d H:i`,
            enableTime: true,
            defaultDate: this._data.schedule.end,
            onChange: this._eventDurationEndHandler
          }
      );
    }
  }

  _eventDestinationHandler(evt) {
    this.updateData({
      city: evt.target.value,
      description: generateRandomDescription()
    });
  }

  _eventPriceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _eventDurationStartHandler(selectedDates) {
    this.updateData({
      schedule: Object.assign({}, this._data.schedule, {start: selectedDates[0]})
    });
  }

  _eventDurationEndHandler(selectedDates) {
    this.updateData({
      schedule: Object.assign({}, this._data.schedule, {end: selectedDates[0]})
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.event__type-label`).forEach((item) => item.addEventListener(`click`, this._eventTypeHandler));
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._eventDestinationHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._eventPriceHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(point) {
    this.updateData(
        NewPoint.parsePointToData(point)
    );
  }

  _formSubmitHandler(evt) {

    evt.preventDefault();
    this._callback.formSubmit(NewPoint.parseDataToPoint(BLANK_POINT));
  }

  setFormSubmitHandler(callback) {

    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    // this._data.removeElement()
    this._callback.deleteClick(NewPoint.parseDataToPoint(BLANK_POINT));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          type: point.type,
          additionals: point.additionals,
          city: point.city,
          description: point.pointInfo.description,
          photo: point.pointInfo.photo,
          price: point.price,
          schedule: point.schedule
        }
    );
  }

  static parseDataToPoint(BLANK_POINT) {
    return Object.assign({}, BLANK_POINT);
  }

}
*/
