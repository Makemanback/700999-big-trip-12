import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import FilterModel from './model/filter.js';
import PointsModel from './model/points.js';

import PageMenuView from './view/page-menu.js';
import NoPointsView from './view/no-points.js';
import EmptyTripInfoView from './view/empty-trip-info.js';

import {generateTripPoint} from './mock/trip-day.js';

import {render, RenderPosition} from './utils/render.js';

import {MenuItem} from "./const.js";
import EventButton from './view/new-event-button.js';

const pageBodyElement = document.querySelector(`.page-body`);
const pageHeader = document.querySelector(`.page-header`);
const pageTripEvents = document.querySelector(`.trip-events`);
const pageTripMain = pageHeader.querySelector(`.trip-main`);
const pageTripControls = pageTripMain.querySelector(`.trip-controls`);
const pageTripControlsMenu = pageTripMain.querySelector(`.trip-controls`);

const pageMenuComponent = new PageMenuView();
const newEventButton = new EventButton();

render(pageTripControlsMenu, pageMenuComponent, RenderPosition.BEFOREEND);

render(pageTripMain, newEventButton, RenderPosition.BEFOREEND);

const filterModel = new FilterModel();

const POINTS_COUNT = 10;

const points = new Array(POINTS_COUNT).fill(``).map(generateTripPoint);

const pointsModel = new PointsModel();
pointsModel.set(points);

new FilterPresenter(pageTripControls, filterModel, pointsModel).init();


if (pointsModel.areExist()) {
  render(pageTripMain, new EmptyTripInfoView(), RenderPosition.AFTERBEGIN);
  render(pageTripEvents, new NoPointsView(), RenderPosition.BEFOREEND);
} else {
  const tripPresenter = new TripPresenter(pageBodyElement, pointsModel, filterModel);

  const handlePageMenuClick = (menuItem) => {
    switch (menuItem) {
      case MenuItem.TABLE:
        // Скрыть статистику
        // Показать доску
        // Показать форму добавления новой задачи
        // Убрать выделение с ADD NEW TASK после сохранения
        break;
      case MenuItem.STATS:
        // Скрыть доску
        // Показать статистику
        break;
    }
  };

  pageMenuComponent.setMenuClickHandler(handlePageMenuClick);

  tripPresenter.init();

  newEventButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createPoint();
  });
}
