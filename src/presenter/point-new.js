import TripEditView from '../view/trip-edit.js';
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(tripContainer, changeData, newEventButton, destinations, offers) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._newEventButton = newEventButton;
    this._tripEditComponent = null;
    this._destroyCallback = null;
    this._destinations = destinations;
    this._offers = offers;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {

    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new TripEditView(this._destinations, this._offers);
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
    this._newEventButton.getElement().disabled = false;
  }

  setSaving() {
    this._tripEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    if (this._tripEditComponent) {
      this._tripEditComponent.shake(resetFormState);
    }
  }

  _handleFormSubmit(point) {

    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
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
