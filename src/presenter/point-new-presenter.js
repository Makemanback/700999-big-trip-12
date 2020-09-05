import NewPointView, { BLANK_POINT } from "../view/point-new.js";
import {generateId} from "../mock/trip-day.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(tripContainer, changeData) {
    this._changeData = changeData;

    this._tripContainer = tripContainer;
    this._newPointComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._newPointComponent !== null) {
      return;
    }

    this._newPointComponent = new NewPointView();
    this._newPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._newPointComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripContainer, this._newPointComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {

    if (this._newPointComponent === null) {
      return;
    }

    remove(this._newPointComponent);
    this._newPointComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
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
