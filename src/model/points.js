import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._destinations = [];
    this._offers = [];
  }

  set(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  get() {
    return this._points;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  areExist() {
    return this._points.length > 0;
  }

  getStartDates() {

    const startDates = [];
    const pointDates = this._points.map((point) => point.schedule.start);
    pointDates.forEach((start) => {
      let isExist = false;
      for (const startDate of startDates) {
        if (startDate.getDate() === start.getDate()) {

          isExist = true;
        }
      }
      if (!isExist) {
        startDates.push(start);
      }
    });

    return startDates.sort((a, b) => a - b);

  }

  getCities() {
    return this._points.slice().sort((a, b) => a.schedule.start - b.schedule.start).map(({destination}) => destination.name);
  }

  getPrice() {
    return this._points.reduce((accumulator, {additionals, price}) => {
      const offersTotalPrice = additionals.reduce((accumulatorInner, {price: offerPrice}) => {
        return offerPrice + accumulatorInner;
      }, 0);

      return offersTotalPrice + accumulator + price;
    }, 0);
  }

  checkLength() {
    return this._points.length > 0;
  }

  update(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          schedule: {
            start: point[`date_from`] = new Date(point.date_from),
            end: point[`date_to`] = new Date(point.date_to)
          },
          isFavorite: point.is_favorite,
          additionals: point.offers,
        });

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;
    delete adaptedPoint.pictures;

    return adaptedPoint;
  }

  static adaptToServer(point) {

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          'base_price': point.price,
          'date_from': point.schedule.start instanceof Date ? point.schedule.start.toISOString() : null,
          'date_to': point.schedule.end instanceof Date ? point.schedule.end.toISOString() : null,
          "is_favorite": point.isFavorite,
          'offers': point.additionals,
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.additionals;
    delete adaptedPoint.pictures;
    delete adaptedPoint.description;
    delete adaptedPoint.name;

    return adaptedPoint;
  }
}
