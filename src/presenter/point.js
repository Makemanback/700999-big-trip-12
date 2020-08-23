import {render, RenderPosition, replace} from "../utils/render.js";
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit.js';

export default class Point {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init(daysList, point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new TripPointView(point);
    this._pointEditComponent = new TripEditView(point);

    this._pointComponent.setClickHandler(this._handleEditClick);
    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);

    render(daysList, this._pointComponent, RenderPosition.BEFOREEND);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      // debugger
      // console.log(daysList.getElement());
      render(daysList, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (daysList.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (daysList.getElement().contains(prevPointEditComponent.getElement())) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  };

  _replaceFormToPoint() {
    replace(this._pointEditComponent, this._pointComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  };

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }
}
