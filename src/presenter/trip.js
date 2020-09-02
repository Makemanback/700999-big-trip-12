import TripDaysListView from '../view/trip-list.js';
import TripDayView from '../view/trip-day.js';

import TripInfoView from '../view/page-trip-info';
import EmptyDayView from '../view/empty-trip-day.js';

import PageSortingView from '../view/page-sorting.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {formatDate, getTripStart, getTripEnd} from '../utils/date.js';
import {sortPointsByPrice, sortPointsByDuration} from '../utils/common.js';
import {SortType} from '../view/page-sorting.js';
import {UpdateType, UserAction} from "../const.js";

import PointPresenter from "./point.js";

export default class Trip {
  constructor(tripContainer, pointsModel, startDates, arrCities, totalPrice) {
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._datesContainer = tripContainer.querySelector(`.trip-events`);
    this._tripInfoContainer = tripContainer.querySelector(`.trip-main`);
    this._startDates = startDates;
    this._arrCities = arrCities;
    this._totalPrice = totalPrice;
    this._pointPresenter = {};

    this._daysListComponent = new TripDaysListView();

    this._tripInfoComponent = new TripInfoView(this._arrCities, getTripStart(this._startDates[0]), getTripEnd(this._startDates[this._startDates.length - 1]), this._totalPrice);
    this._emptyDayComponent = new EmptyDayView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    // this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    // this._pageSortingComponent = new PageSortingView();
    this._pageSortingComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DURATION:
        return sortPointsByDuration(this._pointsModel.getPoints().slice());
      case SortType.PRICE:
        return sortPointsByPrice(this._pointsModel.getPoints().slice());
    }

    return this._pointsModel.getPoints();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // _handlePointChange(updatedPoint) {
  //   this._tripPoints = updateItem(this._tripPoints, updatedPoint);
  //   this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
  //   this._pointPresenter[updatedPoint.id].init(this._daysList, updatedPoint);
  // }

  _handleViewAction(actionType, updateType, update) {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
      break;
    case UserAction.ADD_POINT:
      this._pointsModel.addPoint(updateType, update);
      break;
    case UserAction.DELETE_POINT:
      this._pointsModel.deletePoint(updateType, update);
      break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(this._daysList, data);
        break;
      case UpdateType.MINOR:
          this._clearPointsList();
          this._renderSortedPoints();
          this._pointPresenter[data.id].init(this._daysList, data);
        break;
      case UpdateType.MAJOR:

        // this._renderTrip();
        break;
    }
  }

  _renderDaysList() {
    render(this._datesContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderDay() {
    const daysContainer = this._datesContainer.querySelector(`.trip-days`);

    this._startDates.forEach((item, index) => {
      render(daysContainer, new TripDayView(item, index + 1), RenderPosition.BEFOREEND);
    });
  }

  _renderPoint(daysList, point) {

    const pointPresenter = new PointPresenter(this._daysListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(daysList, point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderAllPoints() {
    let pageTripDayViews = this._datesContainer.querySelectorAll(`.trip-days__item`);

    this._getPoints().forEach((point) => {
      pageTripDayViews.forEach((pageTripDayView) => {
        if (formatDate(point.schedule.start) === pageTripDayView.querySelector(`.day__date`).getAttribute(`datetime`)) {
          this._renderPoint(pageTripDayView.querySelector(`.trip-events__list`), point);
        }
      });
    });
  }

  _renderPageSorting() {
    if (this._pageSortingComponent !== null) {
      this._pageSortingComponent = null;
    }

    this._pageSortingComponent = new PageSortingView(this._currentSortType);
    this._pageSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._datesContainer, this._pageSortingComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearPointsList();
    if (SortType.DEFAULT === sortType) {
      this._renderDay();
      this._renderAllPoints();
    } else {
      this._renderSortedPoints();
    }
  }

  _renderSortedPoints() {
    const daysContainer = this._datesContainer.querySelector(`.trip-days`);
    render(daysContainer, this._emptyDayComponent, RenderPosition.BEFOREEND);

    const pointContainers = this._datesContainer.querySelector(`.trip-events__list`);
    this._getPoints().forEach((point) => this._renderPoint(pointContainers, point));
  }

  _clearPointsList() {
    this._daysListComponent.getElement().innerHTML = ``;

    Object
    .values(this._pointPresenter)
    .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    // remove(this._pageSortingComponent)
    // if (resetSortType) {
    //   this._currentSortType = SortType.DEFAULT;
    // }
  }

  _renderTrip() {
    this._renderPageSorting();
    this._renderDaysList();
    this._renderTripInfo();
    this._renderDay();
    this._renderAllPoints();
  }
}
