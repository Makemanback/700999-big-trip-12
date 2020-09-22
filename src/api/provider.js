import {nanoid} from "nanoid";
import PointsModel from "../model/points.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storeCommon, pointsStore) {
    this._api = api;
    this._storeCommon = storeCommon;
    this._pointsStore = pointsStore;
  }


  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {

          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._pointsStore.setItems(items);

          return points;
        });
    }

    const storePoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._storeCommon.setItem(`destinations`, destinations.slice());
          return destinations;
        });
      }

    const storeDestinations = Object.values(this._storeCommon.getItem(`destinations`));

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._storeCommon.setItem(`offers`, offers.slice());
          return offers;
        });
    }

    const storeOffers = Object.values(this._storeCommon.getItem(`offers`));

    return Promise.resolve(storeOffers);
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._pointsStore.setItem(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._pointsStore.removeItem(point.id));
    }

    this._pointsStore.removeItem(point.id);

    return Promise.resolve();
  }



  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._pointsStore.getItems());

      return this._api.sync(storePoints)
        .then((response) => {

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
