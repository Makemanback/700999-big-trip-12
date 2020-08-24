import {render, RenderPosition, replace, remove} from "../utils/render.js";
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit.js';

export default class Point {
  constructor(pointsContainer, changeData) {
    this._pointsContainer = pointsContainer;


    this._changeData = changeData;


    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);


    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);


  }

  init(daysList, point) {

    this._point = point;
    this._daysList = daysList;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new TripPointView(point);
    this._pointEditComponent = new TripEditView(point);

    this._pointComponent.setClickHandler(this._handleEditClick);
    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);

    this._pointEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._daysList, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    // здесь такое условие тк по-другому не получилось чтобы консоль не ругалась
    if (this._daysList.querySelector(`.trip-events__item > event`)) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._daysList.querySelector(`.trip-events__item`)) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointEditComponent);
    remove(prevPointComponent);
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
    replace(this._pointComponent, this._pointEditComponent);
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


  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }


  _handleFormSubmit(

    point

    ) {

    this._changeData(point);


    this._replaceFormToPoint();
  }
}
