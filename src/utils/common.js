export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffleArray = (arr) => {
  let j; let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

export const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

export const sortPointsByPrice = (arr) => {
  return arr.slice().sort((firstElement, secondElement) => secondElement.price - firstElement.price);
};

export const sortPointsByDuration = (arr) => {
  return (
    arr.slice().sort((firstPoint, secondPoint) => {
      if (firstPoint.schedule.end - firstPoint.schedule.start > secondPoint.schedule.end - secondPoint.schedule.start) {
        return -1;
      }
      return 1;
    })
  );
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const generateRandomBoolean = () => Boolean(Math.round(Math.random()));

export const getAnyRandomInteger = (a = 0, b = 1) => {
  const value = getRandomInteger(a, b);

  return generateRandomBoolean() ? value : -value;
};
