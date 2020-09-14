export const formatDate = (obj) => {
  const month = obj.getMonth();
  const day = obj.getDate();

  return `${obj.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

export const getTripStart = (obj) => obj.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
export const getTripEnd = (obj) => obj.toLocaleString(`en-US`, {day: `numeric`});

export const isPointExpired = (date) => !(date.getTime() < Date.now());
