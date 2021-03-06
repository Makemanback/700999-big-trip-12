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

import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from "./point-new.js";

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, newEventButton, api) {

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._newEventButton = newEventButton;
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
    this._emptyDayComponent = new EmptyDayView();
    this._emptyTripInfoComponent = new EmptyTripInfoView();
    this._noPointsComponent = new NoPointsView();

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleTripInfoUpdate = this._handleTripInfoUpdate.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleTripInfoUpdate);
    this._filterModel.addObserver(this._handleModelEvent);

    this._restoreSortType();
    this._renderTrip();
  }

  destroy() {
    this._clearTrip();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._pointsModel.removeObserver(this._handleTripInfoUpdate);
    this._filterModel.removeObserver(this._handleModelEvent);
  }


  clearStats() {
    remove(this._statsComponent);
  }

  createPoint(callback) {
    this._pointNewPresenter = new PointNewPresenter(this._tripContainer, this._handleViewAction, this._newEventButton, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    this._restoreSortType();
    this._pointNewPresenter.init(callback);
    this._renderPageSorting();
    this._updatePointsList();
  }

  renderStats() {
    this._statsComponent = new StatsView(this._pointsModel.get());
    render(this._tripContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip() {
    this._restoreSortType();
    this._deletePageSorting();
    if (this._pointNewPresenter) {
      this._pointNewPresenter.destroy();
    }

    remove(this._daysListComponent);
    remove(this._loadingComponent);
  }

  _restoreSortType() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  _getPoints() {
    const filterType = this._filterModel.get();

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
    if (this._pointNewPresenter) {
      this._pointNewPresenter.destroy();
    }

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.update(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.add(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:

        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.delete(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleTripInfoUpdate() {
    if (this._pointsModel.areExist()) {
      this._renderTripInfo();
    } else {
      this._renderEmptyTripInfo();
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
        this._currentSortType = SortType.DEFAULT;
        this._updatePointsList();
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
    const filterType = this._filterModel.get();

    this._pointsModel.getStartDates()
    .forEach((date, index) => {
      switch (filterType) {
        case FilterType.PAST:
          if (!isPointExpired(date)) {
            this._renderPageSorting();
            render(daysContainer, new TripDayView(date, index + 1), RenderPosition.BEFOREEND);
          }
          break;
        case FilterType.FUTURE:
          if (isPointExpired(date)) {
            this._renderPageSorting();
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
    const pointPresenter = new PointPresenter(this._handleViewAction, this._handleModeChange, this._pointsModel.getDestinations(), this._pointsModel.getOffers());
    pointPresenter.init(daysList, point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
    }

    if (this._emptyTripInfoComponent !== null) {
      remove(this._emptyTripInfoComponent);
    }

    const startDates = this._pointsModel.getStartDates();
    const startDate = getTripStart(startDates[0]);
    const endDate = getTripEnd(startDates[startDates.length - 1]);
    this._tripInfoComponent = new TripInfoView(this._pointsModel.getCities(), startDate, endDate, this._pointsModel.getPrice());

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
    }
    render(this._tripInfoContainer, this._emptyTripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderAllPoints() {
    const pageTripDayViews = this._tripContainer.querySelectorAll(`.trip-days__item`);

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

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }


    if (!this._pointsModel.areExist()) {
      render(this._tripInfoContainer, new EmptyTripInfoView(), RenderPosition.AFTERBEGIN);
      render(this._tripContainer, new NoPointsView(), RenderPosition.BEFOREEND);
      return;
    }

    this._renderPageSorting();
    this._renderDaysList();
    this._renderDays();
    this._renderAllPoints();
  }
}

