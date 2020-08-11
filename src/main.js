import {createPageMenuTemplate} from './view/page-menu.js';
import {createPageFiltersTemplate} from './view/page-filters.js';
import {createPageTripInfoTemplate} from './view/page-trip-info.js';
import {createPageSortingTemplate} from './view/page-sorting.js';
import {createPageTripEditTemplate} from './view/trip-edit.js';
import {createPageTripDaysListTemplate} from './view/trip-list.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createTripPointTemplate} from './view/trip-point.js';
import {generateTripPoint} from './mock/trip-day.js';
import {render, formatDate, getTripStart, getTripEnd} from './utils.js';

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
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls > h2`);
const pageMainElement = document.querySelector(`.page-main`);
const pageEvents = pageMainElement.querySelector(`.trip-events`);

render(pageTripControlsMenu, createPageMenuTemplate(), `afterend`);
render(pageTripControls, createPageFiltersTemplate(), `beforeend`);
render(pageTripMain, createPageTripInfoTemplate(arrCities, getTripStart(startDates[0]), getTripEnd(startDates[startDates.length - 1]), totalPrice), `afterbegin`);
render(pageEvents, createPageSortingTemplate(), `beforeend`);
render(pageEvents, createPageTripEditTemplate(points[0]), `beforeend`);
render(pageEvents, createPageTripDaysListTemplate(), `beforeend`);

const PageTripDaysList = pageEvents.querySelector(`.trip-days`);

startDates.forEach((item, index) => {
  render(PageTripDaysList, createTripDayTemplate(item, index + 1), `beforeend`);
});

const pageTripDays = PageTripDaysList.querySelectorAll(`.trip-days__item`);

for (let i = 0; i < POINTS_COUNT; i++) {
  pageTripDays.forEach((item) => {
    if (formatDate(points[i].schedule.start) === item.querySelector(`.day__date`).getAttribute(`datetime`)) {
      render(item.querySelector(`.trip-events__list`), createTripPointTemplate(points[i]), `beforeend`);
    }
  });
}

