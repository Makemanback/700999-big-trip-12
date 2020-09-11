import {NonTravelPoint} from '../const.js';
import {Time} from '../mock/trip-day.js';


export const getUniqueMeanings = (array) => [...new Set(array)];

export const createUniqeTypes = (points) => getUniqueMeanings(points.map((item) => item.type));


export const getPointByTypePrice = (points) => {
  const getAllPrices = () => {
    const obj = {};
    createUniqeTypes(points).forEach((typeName) => {
      const price = points
      .filter((point) => point.type === typeName)
      .reduce((accumulator, value) => {
        return accumulator + value.price;
      }, 0);
      obj[typeName] = price;
    });
    return obj;
  };
  return getAllPrices();
};


export const createTravelTypes = (points) => {
  const arr = [];
  points.forEach((item) => {
    if (item.type !== NonTravelPoint.SIGHTSEEING && item.type !== NonTravelPoint.CHECK_IN && item.type !== NonTravelPoint.RESTAURANT) {
      arr.push(item.type);
    }
  });

  return arr;
};


export const countTimeSpend = (points) => {
  const obj = {};
  const types = createUniqeTypes(points);
  types.forEach((type) => {
    const duration = points.filter((point) => point.type === type)
    .reduce((accumulator, point) => {
      return accumulator + getTime(point.schedule.start, point.schedule.end);
    }, 0);
    obj[type] = duration;
  });

  return obj;
};

export const getTime = (start, end) => Math.round((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);


export const countTravelType = (points) => {
  const countedTypes = [];
  const typeNames = getUniqueMeanings(createTravelTypes(points));

  typeNames.forEach((type) => countedTypes.push(countTypeRepeat(points, type)));
  return countedTypes;
};

export const countTypeRepeat = (point, typeName) => {

  return createTravel(point).filter((item) => item === typeName).length;
};


const createTravel = (points) => points.filter((point) => point.type !== NonTravelPoint.SIGHTSEEING && point.type !== NonTravelPoint.CHECK_IN && point.type !== NonTravelPoint.RESTAURANT).map((point) => point.type);

export const travelRepeats = (point, typeName) => {
  return (point).filter((item) => item === typeName).length;
};


export const getTravelTypeByRepeats = (points) => {
  const travelTypes = points.filter((point) => point.type !== NonTravelPoint.SIGHTSEEING && point.type !== NonTravelPoint.CHECK_IN && point.type !== NonTravelPoint.RESTAURANT).map((point) => point.type);
  const obj = {};
  const uniqueTravelTypes = getUniqueMeanings(travelTypes);

  uniqueTravelTypes.forEach((type) => {
    const repeation = points.filter((point) => point.type === type)
    .reduce((accumulator, point) => {
      // вот в этой функции так и не понял что плюсовать к аккумулятору, чтобы получить количество повторов
      return accumulator + point.type;

    }, 0);
    obj[type] = repeation;
  });

  return obj;
};
