import PageMenuView from './view/page-menu.js';
import PageFiltersView from './view/page-filters.js';
import PageTripInfoView from './view/page-trip-info.js';
import PageSortingView from './view/page-sorting.js';
import TripEdit from './view/trip-edit.js';
import TripDaysListView from './view/trip-list.js';

import TripDayView from './view/trip-day.js';
import PointsListView from './view/points-list.js';
import TripPointView from './view/trip-point.js';
import FirstPointView from './view/first-point.js';
import EmptyTripInfoView from './view/empty-trip-info.js';

import {generateTripPoint} from './mock/trip-day.js';
import {render, RenderPosition, formatDate, getTripStart, getTripEnd} from './utils.js';


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

const pageHeader = document.querySelector(`.page-header`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);
const pageMainElement = document.querySelector(`.page-main`);
const pageEvents = pageMainElement.querySelector(`.trip-events`);

render(pageTripControlsMenu, new PageMenuView().getElement(), RenderPosition.BEFOREEND);
render(pageTripControls, new PageFiltersView().getElement(), RenderPosition.BEFOREEND);

if (POINTS_COUNT === 0) {
  render(pageEvents, new FirstPointView().getElement(), RenderPosition.BEFOREEND);
  render(pageTripMain, new EmptyTripInfoView().getElement(), RenderPosition.AFTERBEGIN);
} else {
  render(pageEvents, new PageSortingView().getElement(), RenderPosition.BEFOREEND);
  render(pageEvents, new TripDaysListView().getElement(), RenderPosition.BEFOREEND);
  render(pageTripMain, new PageTripInfoView(arrCities, getTripStart(startDates[0]), getTripEnd(startDates[startDates.length - 1]), totalPrice).getElement(), RenderPosition.AFTERBEGIN);

  const pageTripDaysListView = pageEvents.querySelector(`.trip-days`);

  startDates.forEach((item, index) => {
    render(pageTripDaysListView, new TripDayView(item, index + 1).getElement(), RenderPosition.BEFOREEND);
  });

  const pageTripDayViews = pageTripDaysListView.querySelectorAll(`.trip-days__item`);

  for (let i = 0; i < pageTripDayViews.length; i++) {
    render(pageTripDayViews[i], new PointsListView().getElement(), RenderPosition.BEFOREEND);
  }

  const renderPoints = (tripDay, point) => {
    const pointComponent = new TripPointView(point);
    const pointEditComponent = new TripEdit(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replacePointToForm = () => {
      tripDay.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      tripDay.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
    };

    pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      replacePointToForm();
    });

    pointEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(tripDay, pointComponent.getElement(), RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < POINTS_COUNT; i++) {
    pageTripDayViews.forEach((pageTripDayView) => {
      if (formatDate(points[i].schedule.start) === pageTripDayView.querySelector(`.day__date`).getAttribute(`datetime`)) {
        renderPoints(pageTripDayView.querySelector(`.trip-events__list`), points[i]);
      }
    });
  }
}


