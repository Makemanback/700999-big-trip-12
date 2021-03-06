import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import {Type, SHAKE_ANIMATION_TIMEOUT} from '../const.js';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from "he";

export const BLANK_POINT = {
  isFavorite: false,
  type: Type.TAXI,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  additionals: [],
  schedule: {
    start: new Date(),
    end: new Date()
  },
  price: ``,
};


export const createTypeItemsTemplate = (type) => {
  return type.map((pointType) => {
    return (
      `<div class='event__type-item'>
        <input id='event-type-${pointType}-1' class='event__type-input  visually-hidden' type='radio' name='event-type' value='${pointType}'>
        <label class='event__type-label  event__type-label--${pointType.toLowerCase()}' for='event-type-${pointType}-1'>${pointType}</label>
      </div>`
    );
  }).join(``);
};

export const createAdditionals = (additionals, isChecked) => {

  return additionals.map(({title, price}, index) => {
    return (
      `<div class='event__offer-selector'>
        <input class='event__offer-checkbox  visually-hidden' id='event-offer-${title}-${index + 1}' type='checkbox' name='${he.encode(title)}' ${isChecked ? `checked` : ``} >
        <label class='event__offer-label' for='event-offer-${title}-${index + 1}'>
          <span class='event__offer-title'>${title}</span>
          &plus;
          &euro;&nbsp;<span class='event__offer-price'>${price}</span>
        </label>
      </div>`
    );
  }).join(``);
};

const createCities = (names) => {
  return names.map((item) => {
    return (
      `<option value='${item}'></option>`
    );
  }).join(``);
};

const createPhotos = (pictures) => {
  return pictures.map((item) => {
    return (
      `<img class='event__photo' src='${item.src}' alt='${item.description}'>`
    );
  }).join(``);
};
export const createDescription = ({description, pictures}) => {

  return (
    `<section class='event__section  event__section--destination'>
      <h3 class='event__section-title  event__section-title--destination'>Destination</h3>
      <p class='event__destination-description'>${description}</p>
      <div class='event__photos-container'>
        <div class='event__photos-tape'>
        ${createPhotos(pictures)}
        </div>
      </div>
      </section>
    </section>`
  );
};

const createPageTripEditTemplate = ({additionals, price, type, isFavorite, schedule, destination, isDisabled, isDeleting, isSaving}, destinations, uncheckedOffers) => {
  const {name, description, pictures} = destination;
  const {start, end} = schedule;

  return (
    `<div>
    <form class='trip-events__item event event--edit' action='#' method='post'>
      <header class='event__header'>
        <div class='event__type-wrapper'>
          <label class='event__type  event__type-btn' for='event-type-toggle-1'>
            <span class='visually-hidden'>Choose event type</span>
            <img class='event__type-icon' width='17' height='17' src='img/icons/${type}.png' alt='${type} icon'>
          </label>
          <input class='event__type-toggle  visually-hidden' id='event-type-toggle-1' type='checkbox'>
          <div class='event__type-list'>
            <fieldset class='event__type-group'>
              <legend class='visually-hidden'>Transfer</legend>
               ${createTypeItemsTemplate(Object.values(Type).slice(0, 7))}
            </fieldset>
            <fieldset class='event__type-group'>
              <legend class='visually-hidden'>Activity</legend>
              ${createTypeItemsTemplate(Object.values(Type).slice(7, 10))}
            </fieldset>
          </div>
        </div>
        <div class='event__field-group  event__field-group--destination'>
          <label class='event__label  event__type-output' for='event-destination-1'>
            ${type} to
          </label>
          <input class='event__input  event__input--destination' id='event-destination-1' type='text' name='event-destination' value='${name}' list='destination-list-1' required>
          <datalist id='destination-list-1'>
            ${createCities(destinations.map(({name: city}) => city))}
          </datalist>
        </div>
        <div class='event__field-group  event__field-group--time'>
          <label class='visually-hidden' for='event-start-time-1'>
            From
          </label>
          <input class='event__input  event__input--time' id='event-start-time-1' type='text' name='event-start-time' value='${start}'>
          &mdash;
          <label class='visually-hidden' for='event-end-time-1'>
            To
          </label>
          <input class='event__input  event__input--time' id='event-end-time-1' type='text' name='event-end-time' value='${end}'>
        </div>
        <div class='event__field-group  event__field-group--price'>
          <label class='event__label' for='event-price-1'>
            <span class='visually-hidden'>Price</span>
            &euro;
          </label>
          <input class='event__input  event__input--price' id='event-price-1' type='number' name='event-price' value='${price}' required>
        </div>
        <button class='event__save-btn  btn  btn--blue' type='submit' ${isSaving ? `disabled` : ``}>${isSaving ? `Saving` : `Save`}</button>
        <button class='event__reset-btn' type='reset' ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>
        <input id='event-favorite-1' class='event__favorite-checkbox  visually-hidden' type='checkbox' name='event-favorite' ${isFavorite ? `checked` : ``}>
        <label class='event__favorite-btn' for='event-favorite-1'>
          <span class='visually-hidden'>Add to favorite</span>
          <svg class='event__favorite-icon' width='28' height='28' viewBox='0 0 28 28'>
            <path d='M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z'/>
          </svg>
        </label>
        <button class='event__rollup-btn' type='button'>
          <span class='visually-hidden'>Open event</span>
        </button>
      </header>
      <section class='event__details'>
        <section class='event__section  event__section--offers'>
          <h3 class='event__section-title  event__section-title--offers'>Offers</h3>
          <div class='event__available-offers'>
            ${createAdditionals(additionals, true)}
            ${createAdditionals(uncheckedOffers, false)}
          </div>
        </section>
        ${createDescription({description, pictures})}
      </section>
    </form>
    </div>`
  );
};

export default class TripEdit extends SmartView {
  constructor(destinations, offers, point = BLANK_POINT) {

    super();
    this._data = TripEdit.parsePointToData(point);
    this._datepicker = null;
    this._destinations = destinations;
    this._offers = offers;
    this._uncheckedOffers = this._getUncheckedOffers(this._data.type);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._eventDestinationHandler = this._eventDestinationHandler.bind(this);
    this._eventPriceHandler = this._eventPriceHandler.bind(this);
    this._eventDurationStartHandler = this._eventDurationStartHandler.bind(this);
    this._eventDurationEndHandler = this._eventDurationEndHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createPageTripEditTemplate(this._data, this._destinations, this._uncheckedOffers);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.trip-events__item`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
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
        TripEdit.parsePointToData(point)
    );
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _eventTypeHandler(evt) {
    const type = evt.target.innerText;

    this._uncheckedOffers = this._getUncheckedOffers(type);
    this.updateData({
      type,
      additionals: [],
    });
  }

  _offersChangeHandler(evt) {
    const offerTarget = evt.target;
    const currentOffer = this._getAllOffersByType(this._data.type).find(({title}) => title === offerTarget.name);

    if (offerTarget.checked) {
      this._uncheckedOffers = this._uncheckedOffers.filter(({title}) => title !== offerTarget.name);
      this.updateData({
        additionals: [...this._data.additionals, currentOffer],
      });
    } else {
      this._uncheckedOffers = [...this._uncheckedOffers, currentOffer];
      this.updateData({
        additionals: this._data.additionals.filter(({title}) => title !== offerTarget.name)
      });
    }
  }

  _getAllOffersByType(type) {
    return this._offers.find((offer) => offer.type === type).offers;
  }

  _getUncheckedOffers(type) {
    const allCurrentTypeOffers = this._getAllOffersByType(type);

    if (this._data.additionals.length === 0) {
      return allCurrentTypeOffers;
    }

    const checkedOffersTitles = this._data.additionals.map(({title}) => title);

    return allCurrentTypeOffers.filter(({title}) => !checkedOffersTitles.includes(title));
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
    const cityInput = this.getElement().querySelector(`.event__input--destination`);
    const validationValue = cityInput.value !== `` && this._destinations.map(({name}) => name).some((item) => item === cityInput.value) ? `` : `Please choose city from the list`;
    cityInput.setCustomValidity(validationValue);
    cityInput.reportValidity();

    if (validationValue === ``) {
      const city = evt.target.value;
      const {description, pictures} = this._destinations.find(({name}) => name === city);

      this.updateData({
        destination: {
          name: city,
          description,
          pictures
        }
      });
    }
  }

  _eventPriceHandler(evt) {
    const price = +evt.target.value;
    const validationValue = price < 0 ? `Price must be more than 0 euros` : ``;
    evt.target.setCustomValidity(validationValue);
    if (validationValue === ``) {
      evt.preventDefault();
      this.updateData({
        price
      });
    }
  }

  _eventDurationStartHandler(selectedDates) {
    this.updateData({
      schedule: Object.assign({}, this._data.schedule, {start: selectedDates[0]})
    });
  }

  _eventDurationEndHandler(selectedDates) {
    const startDate = this.getElement().querySelector(`#event-start-time-1`);
    const endDate = this.getElement().querySelector(`#event-end-time-1`);
    const validationValue = endDate.value < startDate.value ? `End date could not be less than start date` : ``;
    endDate.setCustomValidity(validationValue);
    if (validationValue === ``) {
      this.updateData({
        schedule: Object.assign({}, this._data.schedule, {end: selectedDates[0]})
      });
    }
  }

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.event__type-label`)
      .forEach((item) => item.addEventListener(`click`, this._eventTypeHandler));
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._eventDestinationHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._eventPriceHandler);
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
    this.getElement().querySelectorAll(`.event__offer-checkbox`)
      .forEach((item) => item.addEventListener(`click`, this._offersChangeHandler));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripEdit.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TripEdit.parseDataToPoint(this._data));
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isFavorite: point.isFavorite,
          type: point.type,
          additionals: point.additionals,
          price: point.price,
          schedule: point.schedule,
          name: point.destination.name,
          destination: point.destination,
          description: point.destination.description,
          pictures: point.destination.pictures,
          isDeleting: false,
          isSaving: false,
          isDisabled: false
        }
    );
  }

  static parseDataToPoint(data) {
    delete data.isDeleting;
    delete data.isSaving;
    delete data.isDisabled;

    return Object.assign({}, data);
  }

}
