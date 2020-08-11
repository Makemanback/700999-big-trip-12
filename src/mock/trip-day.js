import {getRandomInteger, shuffleArray, getRandomArrayElement} from '../utils.js';

const TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Restaurant`];
export const CITIES = [`Amsterdam`, `Dublin`, `London`, `Rome`, `Paris`, `Berlin`];
const ADDITIONALS = [
  {
    offer: `Order Uber`,
    cost: 20
  },
  {
    offer: `Add luggage`,
    cost: 70
  },
  {
    offer: `Switch to comfort`,
    cost: 200
  },
  {
    offer: `Rent a car`,
    cost: 150
  },
  {
    offer: `Add breakfast`,
    cost: 40
  }
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const generateType = () => getRandomArrayElement(TYPES);

export const generateCity = () => getRandomArrayElement(CITIES);

const generateRandomAdditionals = () => {
  return shuffleArray(ADDITIONALS)
  .slice(0, Math.floor(Math.random() * ADDITIONALS.length));
};

const generateRandomDescription = () => {
  return shuffleArray(DESCRIPTIONS)
  .slice(0, 5)
  .slice(0, Math.random() * DESCRIPTIONS.length + 1)
  .join(``);
};

const Time = {
  DAY_GAP: 5,
  HOUR_GAP: 20,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
  MILLISECONDS: 1000
};

export const getRandomSchedule = () => {
  const start = new Date(Date.now() - getRandomInteger(Time.HOURS * Time.MINUTES * Time.SECONDS * Time.MILLISECONDS, Time.DAY_GAP * Time.HOURS * Time.MINUTES * Time.SECONDS * Time.MILLISECONDS));
  const end = new Date(+start + getRandomInteger(Time.MINUTES * Time.SECONDS * Time.MILLISECONDS, Time.HOUR_GAP * Time.MINUTES * Time.SECONDS * Time.MILLISECONDS));
  return ({
    start,
    end
  });
};

const Price = {
  MIN: 0,
  MAX: 500
};

const generateRandomPrice = () => getRandomInteger(Price.MIN, Price.MAX);

export const generateTripPoint = () => {
  return {
    type: generateType(),
    city: generateCity(),
    additionals: generateRandomAdditionals(),
    pointInfo: {
      description: generateRandomDescription(),
      photo: `http://picsum.photos/248/152?r`
    },
    schedule: getRandomSchedule(),
    price: generateRandomPrice()
  };
};


