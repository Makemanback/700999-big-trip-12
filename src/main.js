import FilterModel from './model/filter.js';
import PointsModel from './model/points.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import PageMenuView from './view/page-menu.js';
import NewEventView from './view/new-event-button.js';

import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType} from "./const.js";

import Api from './api.js';

const AUTHORIZATION = `Basic wferwfwe`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const pageBodyElement = document.querySelector(`.page-body`);
const pageHeader = document.querySelector(`.page-header`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);

const api = new Api(END_POINT, AUTHORIZATION);

const pageMenuComponent = new PageMenuView();
render(pageTripControlsMenu, pageMenuComponent, RenderPosition.BEFOREEND);

const newEventComponent = new NewEventView();
render(pageTripMain, newEventComponent, RenderPosition.BEFOREEND);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();


new FilterPresenter(pageTripControls, filterModel, pointsModel).init();

let statsComponent = null;

const handlePointNewFormClose = (presenter) => {
  newEventComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    presenter.createPoint();
    newEventComponent.getElement().disabled = true;
  });
};


const tripPresenter = new TripPresenter(pageBodyElement, pointsModel, filterModel, newEventComponent, api);

const handlePageMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statsComponent);
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

handlePointNewFormClose(tripPresenter);

tripPresenter.init();

Promise.all([api.getPoints(), api.getDestinations(), api.getOffers()])
  .then(([points, destinations, offers]) => {

    pointsModel.setOffers(offers);
    pointsModel.setDestinations(destinations);
    pointsModel.set(UpdateType.INIT, points);
    console.log(pointsModel.get());
  })
  .catch((
      // error
  ) => {
    // console.log(error);
    pointsModel.set(UpdateType.INIT, []);
  });
