import {createPageMenuTemplate} from './view/page-menu.js';
import {createPageFiltersTemplate} from './view/page-filters.js';
import {createPageTripInfoTemplate} from './view/page-trip-info.js';
import {createPageInfoTemplate} from './view/page-info.js';
import {createPageInfoCostTemplate} from './view/page-info-cost.js';
import {createPageSortingTemplate} from './view/page-sorting.js';
import {createPageTripEditTemplate} from './view/trip-edit.js';
import {createPageTripDaysListTemplate} from './view/trip-list.js';
import {createTripDayTemplate} from './view/trip-day.js';

const POINTS = 3;

const pageHeader = document.querySelector(`.page-header`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls > h2`);
const pageMainElement = document.querySelector(`.page-main`);
const pageEvents = pageMainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(pageTripControlsMenu, createPageMenuTemplate(), `afterend`);
render(pageTripControls, createPageFiltersTemplate(), `beforeend`);
render(pageTripMain, createPageTripInfoTemplate(), `afterbegin`);
render(pageTripMain, createPageInfoCostTemplate(), `afterbegin`);
render(pageTripMain, createPageInfoTemplate(), `afterbegin`);
render(pageEvents, createPageSortingTemplate(), `beforeend`);
render(pageEvents, createPageTripEditTemplate(), `beforeend`);
render(pageEvents, createPageTripDaysListTemplate(), `beforeend`);

const PageTripDaysList = pageEvents.querySelector(`.trip-days`);

for (let i = 0; i < POINTS; i++) {
  render(PageTripDaysList, createTripDayTemplate(), `afterbegin`);
}
