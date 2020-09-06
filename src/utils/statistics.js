import {NonTravelPoint} from '../const.js';
import {Time} from '../mock/trip-day.js';

export const getPointsArray = (points) => Array.from(Object.values(points)[0]);
export const getUniqueMeanings = (array) => [...new Set(array)];

export const createUniqeTypes = (points) => {
  const pointsArray = () => {
    const arr = [];
    getPointsArray(points).forEach((point) => arr.push(point.type));
    return arr;
  };

  return getUniqueMeanings(pointsArray());
};


export const getPointByTypePrice = (points) => {
  const getAllPrices = () => {
    const arr = [];
    createUniqeTypes(points).forEach((item) => {
      arr.push(typePrice(points, item));
    });
    return arr;
  };

  const getAllPricesArr = () => {
    const arr = [];
    getAllPrices().forEach((item) => {
      arr.push(item.price);
    });
    return arr;
  };

  return getAllPricesArr();
};

export const typePrice = (points, typeName) => {
  const price = getPointsArray(points)
  .filter((item) => item.type === typeName)
  .reduce((accumulator, value) => {
    return accumulator + value.price;
  }, 0);

  return (
    {typeName, price}
  );
};

export const createTravelTypes = (points) => {
  const arr = [];
  getPointsArray(points).forEach((item) => {
    if (item.type !== NonTravelPoint.SIGHTSEEING && item.type !== NonTravelPoint.CHECK_IN && item.type !== NonTravelPoint.RESTAURANT) {
      arr.push(item.type);
    }
  });

  return arr;
};

export const countTravelType = (points) => {
  const countedTypes = [];
  const typeNames = getUniqueMeanings(createTravelTypes(points));

  typeNames.forEach((type) => countedTypes.push(countTypeRepeat(points, type)));
  return countedTypes;
};

export const countTypeRepeat = (point, typeName) => {
  return createTravelTypes(point).filter((item) => item === typeName).length;
};


/*

  осталось разобраться только со временем в транспорте

*/
export const countTimeSpend = (points) => {
  const durations = [];
  points.forEach((item) => durations.push(getTime(item.schedule.start, item.schedule.end)));

  return durations;
};

export const getTime = (start, end) => {
  // const gapDays = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES / Time.HOURS);
  const gapHours = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);
  return gapHours;

};

// export const getTimeGap = (start, end) => {
//   const gapDays = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES / Time.HOURS);
//   const gapHours = Math.floor((end - start) / Time.MILLISECONDS / Time.SECONDS / Time.MINUTES);
//   const gapMinutes = Math.floor(((end - start) / Time.MILLISECONDS / Time.SECONDS % Time.MINUTES));
//   if (gapMinutes === 0) {
//     return `${gapHours}H`;
//   }

//   if (gapHours >= Time.HOURS) {
//     return `${gapDays}D ${gapHours % Time.HOURS}H ${Math.round(gapMinutes)}M`;
//   } else {
//     return `${gapHours}H ${Math.round(gapMinutes)}M`;
//   }

// };
