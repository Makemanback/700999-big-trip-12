import TripDaysListView from '../view/trip-list.js';
import TripDayView from '../view/trip-day.js';
import TripInfoView from '../view/page-trip-info';
import EmptyDayView from '../view/empty-trip-day.js';
import PageSortingView from '../view/page-sorting.js';
import StatsView from '../view/statistics.js';
import {SortType} from '../view/page-sorting.js';

import {UpdateType, UserAction, FilterType} from '../const.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {formatDate, getTripStart, getTripEnd, isPointExpired} from '../utils/date.js';
import {sortPointsByPrice, sortPointsByDuration} from '../utils/common.js';
import {filter} from '../utils/filter.js';

import PointPresenter from './point.js';
import PointNewPresenter from "./point-new-presenter.js";

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, startDates, arrCities, totalPrice) {

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripInfoContainer = tripContainer.querySelector(`.trip-main`);
    this._tripContainer = tripContainer.querySelector(`.trip-events`);

    this._startDates = startDates;
    this._arrCities = arrCities;
    this._totalPrice = totalPrice;

    this._pointPresenter = {};
    this._pointNewPresenter = new PointNewPresenter(this._tripContainer, this._handleViewAction);

    this._currentSortType = SortType.DEFAULT;
    this._currentFilter = FilterType.EVERYTHING;

    this._daysListComponent = new TripDaysListView();
    this._tripInfoComponent = new TripInfoView(this._arrCities, getTripStart(this._startDates[0]), getTripEnd(this._startDates[this._startDates.length - 1]), this._totalPrice);
    this._emptyDayComponent = new EmptyDayView();
    this._statsComponent = new StatsView();
    this._pageSortingComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearTrip() {
    this._pointNewPresenter.destroy();

    remove(this._daysListComponent);
  }

  clearStats() {
    remove(this._statsComponent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
    this._renderPageSorting();
    this._updatePointsList();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DURATION:
        return sortPointsByDuration(filtredPoints);
      case SortType.PRICE:
        return sortPointsByPrice(filtredPoints);
    }

    return filtredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

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
        this._updatePointsList();
        break;
      case UpdateType.MAJOR:

        break;
    }
  }

  _renderDaysList() {
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderDays() {

    const daysContainer = this._daysListComponent.getElement();
    const filterType = this._filterModel.getFilter();

    this._startDates
    .forEach((date, index) => {
      switch (filterType) {
        case FilterType.FUTURE:
          if (isPointExpired(date)) {
            render(daysContainer, new TripDayView(date, index + 1), RenderPosition.BEFOREEND);
          }
          break;
        case FilterType.PAST:
          if (!isPointExpired(date)) {
            render(daysContainer, new TripDayView(date, index + 1), RenderPosition.BEFOREEND);
          }
          break;
        default:
          render(daysContainer, new TripDayView(date, index + 1), RenderPosition.BEFOREEND);
          break;
      }
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
    let pageTripDayViews = this._tripContainer.querySelectorAll(`.trip-days__item`);

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
      remove(this._pageSortingComponent);
    }

    this._pageSortingComponent = new PageSortingView(this._currentSortType);
    this._pageSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._pageSortingComponent, RenderPosition.AFTERBEGIN);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._updatePointsList();
  }

  _renderSortedPoints() {
    const daysContainer = this._daysListComponent.getElement();

    render(daysContainer, this._emptyDayComponent, RenderPosition.BEFOREEND);

    const pointContainers = this._tripContainer.querySelector(`.trip-events__list`);
    this._getPoints().forEach((point) => this._renderPoint(pointContainers, point));
  }

  _updatePointsList() {
    this._daysListComponent.clearContent();

    Object
    .values(this._pointPresenter)
    .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
    if (SortType.DEFAULT === this._currentSortType) {
      this._renderDays();
      this._renderAllPoints();
    } else {
      this._renderSortedPoints();
    }
  }

  _renderStats() {
    render(this._tripContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    this._renderPageSorting();
    this._renderDaysList();
    this._renderTripInfo();
    this._renderDays();
    this._renderAllPoints();
  }
}
