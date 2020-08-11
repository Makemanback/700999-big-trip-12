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

export const getRandomArrayIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];


export const getRandomProperty = (obj) => {
  let keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const formatDate = (obj) => {
  const month = obj.getMonth();
  const day = obj.getDate();

  return `${obj.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}

export const tripStart = (obj) => obj.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
export const tripEnd = (obj) => obj.toLocaleString(`en-US`, {day: `numeric`});

