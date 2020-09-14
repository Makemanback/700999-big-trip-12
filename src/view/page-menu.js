import AbstractView from "./abstract.js";
import {MenuItem} from '../const.js';

const createPageMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" id="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" id="${MenuItem.STATS}">Stats</a>
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
    this._callback.menuClick(evt.target.id);
  }

  setMenuClickHandler(callback) {

    this._callback.menuClick = callback;

    this.getElement()
    .querySelectorAll(`.trip-tabs__btn`)
    .forEach((item) => item.addEventListener(`click`, this._menuClickHandler));
  }

  setMenuItem(menuItem) {
    const tableItem = this.getElement().querySelector(`#${MenuItem.TABLE}`);
    const statsItem = this.getElement().querySelector(`#${MenuItem.STATS}`);
    const activeClass = `trip-tabs__btn--active`;

    const item = this.getElement().querySelector(`#${menuItem}`);

    switch (item) {
      case tableItem:
        item.classList.add(activeClass);
        statsItem.classList.remove(activeClass);
        break;
      case statsItem:
        item.classList.add(activeClass);
        tableItem.classList.remove(activeClass);
    }

  }
}
