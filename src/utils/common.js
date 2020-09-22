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
