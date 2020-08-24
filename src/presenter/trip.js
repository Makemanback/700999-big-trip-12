import TripDaysListView from '../view/trip-list.js';
import TripDayView from '../view/trip-day.js';

import TripInfoView from '../view/page-trip-info';
import NoPointsView from '../view/no-points.js';
import EmptyTripInfoView from '../view/empty-trip-info.js';
import EmptyDayView from '../view/empty-trip-day.js';

import PageSortingView from '../view/page-sorting.js';

import {render, RenderPosition} from '../utils/render.js';
import {formatDate, getTripStart, getTripEnd} from '../utils/date.js';
import {sortPointsByPrice, sortPointsByDuration, updateItem} from '../utils/common.js';
import {SortType} from '../view/page-sorting.js';

import PointPresenter from "./point.js";

const POINTS_COUNT = 10;

export default class Trip {
  constructor(tripContainer, startDates, arrCities, totalPrice) {
    this._tripContainer = tripContainer;
    this._datesContainer = tripContainer.querySelector(`.trip-events`);
    this._tripInfoContainer = tripContainer.querySelector(`.trip-main`);
    this._startDates = startDates;
    this._arrCities = arrCities;
    this._totalPrice = totalPrice;
    this._pointPresenter = {};

    this._daysListComponent = new TripDaysListView();

    this._tripInfoComponent = new TripInfoView(this._arrCities, getTripStart(this._startDates[0]), getTripEnd(this._startDates[this._startDates.length - 1]), this._totalPrice);
    this._noPointComponent = new NoPointsView();
    this._emptyTripInfoComponent = new EmptyTripInfoView();
    this._emptyDayComponent = new EmptyDayView();

    this._handlePointChange = this._handlePointChange.bind(this);

    this._pageSortingComponent = new PageSortingView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourcedTripPoints = tripPoints.slice();
    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(this._daysList, updatedPoint);
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
    // debugger
    this._daysList = daysList;
    this._point = point;

    const pointPresenter = new PointPresenter(this._daysListComponent

      , this._handlePointChange

      );
    pointPresenter.init(this._daysList, this._point);
    this._pointPresenter[this._point.id] = pointPresenter;
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyTripInfo() {
    render(this._tripInfoContainer, this._emptyTripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoint() {
    render(this._datesContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderAllPoints() {
    let pageTripDayViews = this._datesContainer.querySelectorAll(`.trip-days__item`);

    this._tripPoints.forEach((point) => {
      pageTripDayViews.forEach((pageTripDayView) => {
        if (formatDate(point.schedule.start) === pageTripDayView.querySelector(`.day__date`).getAttribute(`datetime`)) {
          this._renderPoint(pageTripDayView.querySelector(`.trip-events__list`), point);
        }
      });
    });
  }

  _renderPageSorting() {
    render(this._datesContainer, this._pageSortingComponent, RenderPosition.BEFOREEND);
    this._pageSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearPointsList();
    this._sortPoints(sortType);

    if (SortType.DEFAULT === sortType) {
      this._renderDay();
      this._renderAllPoints();
    } else {
      const daysContainer = this._datesContainer.querySelector(`.trip-days`);
      render(daysContainer, this._emptyDayComponent, RenderPosition.BEFOREEND);

      const pointContainers = this._datesContainer.querySelector(`.trip-events__list`);
      this._tripPoints.forEach((point) => this._renderPoint(pointContainers, point));
    }
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DURATION:
        this._tripPoints = sortPointsByDuration(this._tripPoints);
        break;
      case SortType.PRICE:
        this._tripPoints = sortPointsByPrice(this._tripPoints);
        break;
      default:
        this._tripPoints = this._sourcedTripPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _clearPointsList() {
    this._daysListComponent.getElement().innerHTML = ``;

    Object
    .values(this._pointPresenter)
    .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderTrip() {
    if (POINTS_COUNT === 0) {
      this._renderNoPoint();
      this._renderEmptyTripInfo();
      return;
    }

    this._renderPageSorting();
    this._renderDaysList();
    this._renderTripInfo();
    this._renderDay();
    this._renderAllPoints();
  }
}
