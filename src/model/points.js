import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  set(points) {
    this._points = points.slice();
  }

  get() {
    return this._points;
  }

  areExist() {
    return this._points.length === 0;
  }

  getStartDates() {

    const startDates = [];
    const pointDates = this._points.map((point) => point.schedule.start);
    pointDates.forEach((start) => {
      let isExist = false;
      for (let i = 0; i < startDates.length; i++) {
        if (startDates[i].getDate() === start.getDate()) {
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
    return this._points.slice().sort((a, b) => a.schedule.start - b.schedule.start).map((item) => item.city);
  }

  getPrice() {
    return this._points.reduce((accumulator, {additionals, price}) => {
      const offersTotalPrice = additionals.reduce((accumulatorInner, {cost, isChecked}) => {
        return isChecked ? cost + accumulatorInner : accumulatorInner;
      }, 0);

      return offersTotalPrice + accumulator + price;
    }, 0);
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
}