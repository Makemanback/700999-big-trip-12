import TripEditView from '../view/trip-edit.js';
import {generateId} from "../mock/trip-day.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType, MenuItem} from "../const.js";

export default class PointNew {
  constructor(tripContainer, changeData) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;

    this._tripEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {

    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new TripEditView();
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripContainer, this._tripEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {

    if (this._tripEditComponent === null) {
      return;
    }

    remove(this._tripEditComponent);
    this._tripEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    MenuItem.NEW_EVENT.disabled = false;
  }

  _handleFormSubmit(point) {

    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

}
