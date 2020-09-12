import {NonTravelPoint, ActionIcon} from '../const.js';
import {Time} from '../mock/trip-day.js';

const getUniqueMeanings = (array) => [...new Set(array)];


// const createUniqeTypes = (points) => getUniqueMeanings(points.map((item) => item.type));
const getTime = (start, end) => Math.round((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);
// console.log(ActionIcon[`Taxi`])

export const getPointByTypePrice = (points) => {
  const obj = {};
  points.forEach(({type, price}) => {
    if (obj[type]) {
      obj[ActionIcon[type]] += price;
    } else {
      obj[ActionIcon[type]] = price;
    }
  });

  return obj;
};

export const countTimeSpend = (points) => {
  const obj = {};

  points.forEach(({type, schedule}) => {

    if (obj[type]) {
      obj[ActionIcon[type]] += getTime(schedule.start, schedule.end);
    } else {
      obj[ActionIcon[type]] = getTime(schedule.start, schedule.end);
    }
  });
  return obj;
};

export const getTravelTypeByRepeats = (points) => {
  const travelTypes = points.filter((point) => point.type !== NonTravelPoint.SIGHTSEEING && point.type !== NonTravelPoint.CHECK_IN && point.type !== NonTravelPoint.RESTAURANT).map((point) => point.type);
  const obj = {};
  const uniqueTravelTypes = getUniqueMeanings(travelTypes);

  uniqueTravelTypes.forEach((type) => {
    const repeation = points.filter((point) => point.type === type)
    .reduce((accumulator) => {
      return ++accumulator;
    }, 0);
    obj[ActionIcon[type]] = repeation;
  });

  return obj;
};
