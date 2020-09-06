import AbstractView from "./abstract.js";
import {MenuItem} from '../const.js'

const createPageMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" value="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" value="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class PageMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createPageMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target);
    const tableItem = this.getElement().querySelector(`[value=${MenuItem.TABLE}]`);
    const statsItem = this.getElement().querySelector(`[value=${MenuItem.STATS}]`);
    const activeClass = `trip-tabs__btn--active`;


    switch (evt.target.innerText) {
      case MenuItem.STATS:
        evt.target.classList.add(activeClass);
        tableItem.classList.remove(activeClass);
        break;
      case MenuItem.TABLE:
        evt.target.classList.add(activeClass);
        statsItem.classList.remove(activeClass);
        break;
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {

    }
  }
}
