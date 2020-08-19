import TripDaysListView from '../view/trip-list.js';
import TripDayView from '../view/trip-day.js';
import PointsListView from '../view/points-list.js';
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit.js';

import TripInfoView from '../view/page-trip-info';
import NoPointsView from '../view/no-points.js';
import EmptyTripInfoView from '../view/empty-trip-info.js';

import {render, RenderPosition, replace} from '../utils/render.js';
import {formatDate, getTripStart, getTripEnd} from '../utils/date.js';

const POINTS_COUNT = 10;

export default class Trip {
  constructor(tripContainer, tripInfoContainer, startDates, arrCities, totalPrice) {
    this._tripContainer = tripContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._startDates = startDates;
    this._arrCities = arrCities;
    this._totalPrice = totalPrice;

    this._daysListComponent = new TripDaysListView();
    this._pointComponent = new TripPointView();
    this._pointEditComponent = new TripEditView();

    this._tripInfoComponent = new TripInfoView(this._arrCities, getTripStart(this._startDates[0]), getTripEnd(this._startDates[this._startDates.length - 1]), this._totalPrice);
    this._firstPointComponent = new NoPointsView();
    this._emptyTripInfoComponent = new EmptyTripInfoView();
  }

  init(tripPoints) {
    this._tripPoints = tripPoints;

    this._renderTrip();
  }

  _renderDaysList() {
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderDay() {
    let daysContainer = this._tripContainer.querySelector(`.trip-days`);

    this._startDates.forEach((item, index) => {
      render(daysContainer, new TripDayView(item, index + 1), RenderPosition.BEFOREEND);
    });
  }

  _renderPointsListContainer() {
    let pageTripDayViews = this._tripContainer.querySelectorAll(`.trip-days__item`);

    for (let i = 0; i < pageTripDayViews.length; i++) {
      render(pageTripDayViews[i], new PointsListView(), RenderPosition.BEFOREEND);
    }
  }

  _renderPoint(daysList, point) {

    const pointComponent = new TripPointView(point);
    const pointEditComponent = new TripEditView(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => replace(pointComponent, pointEditComponent);

    pointComponent.setClickHandler(() => replacePointToForm());

    pointEditComponent.setSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(daysList, pointComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyTripInfo() {
    render(this._tripInfoContainer, this._emptyTripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFirstPoint() {
    render(this._tripContainer, this._firstPointComponent, RenderPosition.BEFOREEND);
  }

  _renderAllPoints() {
    let pageTripDayViews = this._tripContainer.querySelectorAll(`.trip-days__item`);

    for (let i = 0; i < POINTS_COUNT; i++) {
      pageTripDayViews.forEach((pageTripDayView) => {
        if (formatDate(this._tripPoints[i].schedule.start) === pageTripDayView.querySelector(`.day__date`).getAttribute(`datetime`)) {
          this._renderPoint(pageTripDayView.querySelector(`.trip-events__list`), this._tripPoints[i]);
        }
      });
    }
  }

  _renderTrip() {
    if (POINTS_COUNT === 0) {
      this._renderFirstPoint();
      this._renderEmptyTripInfo();
      return;
    }

    this._renderDaysList();
    this._renderTripInfo();
    this._renderDay();
    this._renderPointsListContainer();
    this._renderAllPoints();
  }
}
