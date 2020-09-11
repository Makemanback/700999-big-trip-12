import {FilterType} from "../const.js";
import {isPointExpired} from "./date.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointExpired(point.schedule.end)),
  [FilterType.PAST]: (points) => points.filter((point) => !isPointExpired(point.schedule.end)),
};
