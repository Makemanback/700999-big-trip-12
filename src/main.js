import FilterModel from './model/filter.js';
import PointsModel from './model/points.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import PageMenuView from './view/page-menu.js';
import NewEventView from './view/new-event-button.js';

import {render, RenderPosition} from './utils/render.js';
import {MenuItem, UpdateType} from "./const.js";

import Api from './api/index.js';
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const Storage = {
  PREFIX: `bigtrip-localstorage-common`,
  PREFIX_POINTS: `bigtrip-localstorage-points`,
  VER: `v12`,
};

const STORE_COMMON = `${Storage.PREFIX}-${Storage.VER}`;
const STORE_POINTS = `${Storage.PREFIX_POINTS}-${Storage.VER}`;
const AUTHORIZATION = `Basic dswewffsfweewfwdwe`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const pageBodyElement = document.querySelector(`.page-body`);
const pageHeader = document.querySelector(`.page-header`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);

const api = new Api(END_POINT, AUTHORIZATION);
const apiWithProvider = new Provider(api, new Store(STORE_COMMON, window.localStorage), new Store(STORE_POINTS, window.localStorage));

const pageMenuComponent = new PageMenuView();
render(pageTripControlsMenu, pageMenuComponent, RenderPosition.BEFOREEND);

const newEventComponent = new NewEventView();
render(pageTripMain, newEventComponent, RenderPosition.BEFOREEND);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

new FilterPresenter(pageTripControls, filterModel, pointsModel).init();

const tripPresenter = new TripPresenter(pageBodyElement, pointsModel, filterModel, newEventComponent, apiWithProvider);

const handlePageMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      pageMenuComponent.setMenuItem(menuItem);
      tripPresenter.clearStats();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      pageMenuComponent.setMenuItem(menuItem);
      tripPresenter.destroy();
      tripPresenter.renderStats();
      break;
  }
};

pageMenuComponent.setMenuClickHandler(handlePageMenuClick);
newEventComponent.setButtonClickHandler(() => {
  tripPresenter.createPoint();
});

tripPresenter.init();

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()])
  .then(([points, destinations, offers]) => {

    pointsModel.setOffers(offers);
    pointsModel.setDestinations(destinations);
    pointsModel.set(UpdateType.INIT, points);

  })
  .catch(() => {
    pointsModel.set(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

