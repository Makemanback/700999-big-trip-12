import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import FilterModel from './model/filter.js';
import PointsModel from './model/points.js';

import PageMenuView from './view/page-menu.js';
import NewEventView from './view/new-event-button.js';

import {generateTripPoint} from './mock/trip-day.js';

import {render, RenderPosition, remove} from './utils/render.js';

import {MenuItem} from "./const.js";

const pageBodyElement = document.querySelector(`.page-body`);
const pageHeader = document.querySelector(`.page-header`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);


const pageMenuComponent = new PageMenuView();
render(pageTripControlsMenu, pageMenuComponent, RenderPosition.BEFOREEND);

const newEventComponent = new NewEventView();
render(pageTripMain, newEventComponent, RenderPosition.BEFOREEND);

const filterModel = new FilterModel();

const POINTS_COUNT = 10;

const points = new Array(POINTS_COUNT).fill(``).map(generateTripPoint);

const pointsModel = new PointsModel();
pointsModel.set(points);


new FilterPresenter(pageTripControls, filterModel, pointsModel).init();

let statsComponent = null;

const handlePointNewFormClose = (presenter) => {
  newEventComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    presenter.createPoint();
    newEventComponent.getElement().disabled = true;
  });
};

const tripPresenter = new TripPresenter(pageBodyElement, pointsModel, filterModel, newEventComponent);

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


