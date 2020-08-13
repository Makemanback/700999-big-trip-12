import PageMenuView from './view/page-menu.js';
import PageFilters from './view/page-filters.js';
import PageTripInfo from './view/page-trip-info.js';
import PageSorting from './view/page-sorting.js';
import TripEdit from './view/trip-edit.js';
import TripDaysList from './view/trip-list.js';

import TripDay from './view/trip-day.js';
import PointList from './view/points-list.js';
import TripPoint from './view/trip-point.js';
// import {createTripPointTemplate} from './view/trip-point.js';


import {generateTripPoint} from './mock/trip-day.js';
import {renderTemplate, renderElement, RenderPosition, formatDate, getTripStart, getTripEnd} from './utils.js';


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

renderElement(pageTripControlsMenu, new PageMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(pageTripControls, new PageFilters().getElement(), RenderPosition.BEFOREEND);

renderElement(pageTripMain, new PageTripInfo(arrCities, getTripStart(startDates[0]), getTripEnd(startDates[startDates.length - 1]), totalPrice).getElement(), RenderPosition.AFTERBEGIN);


renderElement(pageEvents, new PageSorting().getElement(), RenderPosition.BEFOREEND);
renderElement(pageEvents, new TripEdit(points[0]).getElement(), RenderPosition.BEFOREEND);

renderElement(pageEvents, new TripDaysList().getElement(), RenderPosition.BEFOREEND);

const pageTripDaysList = pageEvents.querySelector(`.trip-days`);
startDates.forEach((item, index) => {
  renderElement(pageTripDaysList, new TripDay(item, index + 1).getElement(), RenderPosition.BEFOREEND);
});

const pageTripDays = pageTripDaysList.querySelectorAll(`.trip-days__item`);

for (let i = 0; i < pageTripDays.length; i++) {
  renderElement(pageTripDays[i], new PointList().getElement(), RenderPosition.BEFOREEND);
}

// for (let i = 0; i < POINTS_COUNT; i++) {
//   pageTripDays.forEach((item) => {
//     if (formatDate(points[i].schedule.start) === item.querySelector(`.day__date`).getAttribute(`datetime`)) {
//       renderTemplate(item.querySelector(`.trip-events__list`), createTripPointTemplate(points[i]), `beforeend`);
//     }
//   });
// }

const tripLists = pageTripDaysList.querySelectorAll(`.trip-events__list`);
// console.log(tripLists);

for (let i = 0; i < POINTS_COUNT; i++) {
  pageTripDays.forEach((item) => {
    if (formatDate(points[i].schedule.start) === item.querySelector(`.day__date`).getAttribute(`datetime`)) {
        renderElement(tripLists[i], new TripPoint(points[i]).getElement(), RenderPosition.BEFOREEND);
    }
  });
}

// trip-point пока не решен


