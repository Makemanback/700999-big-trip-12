import TripDaysListView from '../view/trip-list.js';
import TripDayView from '../view/trip-day.js';
import TripInfoView from '../view/page-trip-info';
import EmptyDayView from '../view/empty-trip-day.js';
import EmptyTripInfoView from '../view/empty-trip-info.js';
import NoPointsView from '../view/no-points.js';
import PageSortingView from '../view/page-sorting.js';
import StatsView from '../view/statistics.js';
import LoadingView from "../view/loading.js";

import {SortType} from '../view/page-sorting.js';

import {UpdateType, UserAction, FilterType} from '../const.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {formatDate, getTripStart, getTripEnd, isPointExpired} from '../utils/date.js';
import {sortPointsByPrice, sortPointsByDuration} from '../utils/common.js';
import {filter} from '../utils/filter.js';

import PointPresenter from './point.js';
import PointNewPresenter from "./point-new.js";

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, newEventButton, api) {

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripInfoContainer = tripContainer.querySelector(`.trip-main`);
    this._tripContainer = tripContainer.querySelector(`.trip-events`);

    this._pointPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;

    this._daysListComponent = new TripDaysListView();
    this._emptyDayComponent = new EmptyDayView();
    this._pageSortingComponent = null;
    this._loadingComponent = new LoadingView();

    this._getStartDates = this._pointsModel.getStartDates();

    this._initTripInfo();
    this._emptyDayComponent = new EmptyDayView();
    this._emptyTripInfoComponent = new EmptyTripInfoView();
    this._noPointsComponent = new NoPointsView();

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._tripContainer, this._handleViewAction, newEventButton);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._restoreSortType();
    this._renderTrip();
  }

  destroy() {
    this._clearTrip();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearTrip() {
    this._restoreSortType();
    this._deletePageSorting();
    this._pointNewPresenter.destroy();

    remove(this._daysListComponent);
    remove(this._loadingComponent);
  }

  clearStats() {
    remove(this._statsComponent);
  }

  createPoint(callback) {
    this._restoreSortType();
    this._pointNewPresenter.init(callback);
    this._renderPageSorting();
    this._updatePointsList();
  }

  _restoreSortType() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.get();
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
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.update(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.delete(updateType, update);
        if (this._pointsModel.get().length > 0) {
          this._renderTripInfo();
        } else {
          this._renderEmptyTripInfo();
        }
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
        // this._updatePointsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderDaysList() {
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderDays() {

    const daysContainer = this._daysListComponent.getElement();
    const filterType = this._filterModel.getFilter();

    this._pointsModel.getStartDates()
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

  _initTripInfo() {
    const startDate = getTripStart(this._getStartDates[0]);
    const endDate = getTripEnd(this._getStartDates[this._getStartDates.length - 1]);
    this._tripInfoComponent = new TripInfoView(this._pointsModel.getCities(), startDate, endDate, this._pointsModel.getPrice());
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
    }

    this._initTripInfo();
    if (this._pointsModel.get().length >= 1) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }

  }


  _renderEmptyTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
    }
    render(this._tripInfoContainer, this._emptyTripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
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

  _deletePageSorting() {
    remove(this._pageSortingComponent);
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

  renderStats() {
    this._statsComponent = new StatsView(this._pointsModel.get());
    render(this._tripContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }


    this._renderPageSorting();
    this._renderDaysList();
    this._renderTripInfo();
    this._renderDays();
    this._renderAllPoints();
  }
}
