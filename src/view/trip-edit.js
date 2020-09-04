import SmartView from "./smart.js";
import {CITIES, generateRandomDescription, getAdditionalsByType} from '../mock/trip-day.js';
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createAdditionals = (additionals) => {
  return additionals.map(({isChecked, offer, cost}, index) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
          <span class="event__offer-title">${offer}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${cost}</span>
        </label>
      </div>`
    );
  }).join(``);
};

const createCities = (cities) => {
  return cities.map((item) => {
    return (
      `<option value="${item}"></option>`
    );
  }).join(``);
};

const createDescription = (city, description) => {
  // в будущем поставить фотографии в блок, передать photo аргументом в этой функции
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${city} ${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
          <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
          <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
          <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
          <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
        </div>
      </div>
      </section>
    </section>`
  );
};

const createPageTripEditTemplate = ({additionals, price, type, city, isFavorite, start, end, description, photo}) => {
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
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

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" >
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" >
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" >
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" >
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" >
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" >
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" >
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" >
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" >
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
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
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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

    </form>
  </li>`
  );
};

export default class TripEdit extends SmartView {
  constructor(point) {
    super();
    this._data = TripEdit.parsePointToData(point);
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._eventDestinationHandler = this._eventDestinationHandler.bind(this);
    this._eventPriceHandler = this._eventPriceHandler.bind(this);
    this._eventDurationStartHandler = this._eventDurationStartHandler.bind(this);
    this._eventDurationEndHandler = this._eventDurationEndHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setDatepicker();

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPageTripEditTemplate(this._data);
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

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite ? `checked` : ``
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.event__type-label`).forEach((item) => item.addEventListener(`click`, this._eventTypeHandler));
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._eventDestinationHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._eventPriceHandler);
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  reset(point) {
    this.updateData(
        TripEdit.parsePointToData(point)
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isFavorite: point.isFavorite ? `checked` : ``,
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

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }

}
