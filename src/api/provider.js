import {nanoid} from "nanoid";
import PointsModel from "../model/points.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const getSyncedDestinations = (items) => {
  return items.filter(({success}) => success)
  .map(({payload}) => payload.destination);
}

const getSyncedOffers = (items) => {
  return items.filter(({success}) => success)
  .map(({payload}) => payload.offers);
}

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations.map(PointsModel.adaptToServer));
          this._store.setItems(items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems());

    return Promise.resolve(storeDestinations.map(PointsModel.adaptToClient));
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers.map(PointsModel.adaptToServer));
          this._store.setItems(items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems());

    return Promise.resolve(storeOffers.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    this._store.removeItem(point.id);

    return Promise.resolve();
  }



  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const createdDestinations = getSyncedDestinations(response.created);
          const updatedDestinations = getSyncedDestinations(response.updated);

          const createdOffers = getSyncedOffers(response.created);
          const updatedOffers = getSyncedOffers(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints, ...createdDestinations, ...updatedDestinations, ...createdOffers, ...updatedOffers]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}