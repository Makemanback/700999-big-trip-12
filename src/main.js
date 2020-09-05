import PageMenuView from './view/page-menu.js';
import {generateTripPoint} from './mock/trip-day.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterModel from './model/filter.js';
import NoPointsView from './view/no-points.js';
import EmptyTripInfoView from './view/empty-trip-info.js';
import PointsModel from './model/points.js';
import FilterPresenter from './presenter/filter.js';

import NewPointView, { BLANK_POINT } from './view/point-new.js';
import PointNew from './presenter/point-new-presenter.js';

const pageBodyElement = document.querySelector(`.page-body`);
const pageHeader = document.querySelector(`.page-header`);
const pageTripEvents = document.querySelector(`.trip-events`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);

render(pageTripControlsMenu, new PageMenuView(), RenderPosition.BEFOREEND);

const filterModel = new FilterModel();

const POINTS_COUNT = 10;

const points = new Array(POINTS_COUNT).fill(``).map(generateTripPoint);
const pointDates = points.map((point) => point.schedule.start);
const startDates = [];
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

startDates.sort((a, b) => a - b);

const totalPrice = points.reduce((accumulator, value) => {
  const offerPrice = value.additionals.reduce((accumulatorInner, item) => {
    return item.cost + accumulatorInner;
  }, 0);
  return offerPrice + accumulator + value.price;
}, 0);

const arrCities = points.slice().sort((a, b) => a.schedule.start - b.schedule.start).map((item) => item.city);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterPresenter = new FilterPresenter(pageTripControls, filterModel, pointsModel);

filterPresenter.init();

if (POINTS_COUNT === 0) {
  render(pageTripMain, new EmptyTripInfoView(), RenderPosition.AFTERBEGIN);
  render(pageTripEvents, new NoPointsView(), RenderPosition.BEFOREEND);
} else {
  const tripPresenter = new TripPresenter(pageBodyElement, pointsModel, filterModel, startDates, arrCities, totalPrice);
  tripPresenter.init();

  document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createPoint();
  });
}


// const newPointPresenter = new PointNew(pageTripEvents, BLANK_POINT);
// newPointPresenter.init()
// render(pageTripMain, new NewPointView(BLANK_POINT), RenderPosition.BEFOREEND)
