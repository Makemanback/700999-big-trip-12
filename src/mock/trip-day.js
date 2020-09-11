import {getRandomInteger, shuffleArray, getRandomArrayElement, generateRandomBoolean, getAnyRandomInteger} from '../utils/common.js';


export const CITIES = [`Amsterdam`, `Dublin`, `London`, `Rome`, `Paris`, `Berlin`];
export const Type = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECK_IN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`
};
export const ADDITIONALS = [
  {
    offer: `Order Uber`,
    cost: 20,
    type: Type.TAXI,
    isChecked: false
  },
  {
    offer: `Turn off music`,
    cost: 10,
    type: Type.TAXI,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 40,
    type: Type.TAXI,
    isChecked: false
  },
  {
    offer: `Add luggage`,
    cost: 20,
    type: Type.BUS,
    isChecked: false
  },
  {
    offer: `Switch on conditioner`,
    cost: 55,
    type: Type.BUS,
    isChecked: false
  },
  {
    offer: `Open the window`,
    cost: 7,
    type: Type.BUS,
    isChecked: false
  },
  {
    offer: `Add breakfast`,
    cost: 70,
    type: Type.TRAIN,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 45,
    type: Type.TRAIN,
    isChecked: false
  },
  {
    offer: `Pass the station`,
    cost: 15,
    type: Type.BUS,
    isChecked: false
  },
  {
    offer: `Add luggage`,
    cost: 40,
    type: Type.SHIP,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 30,
    type: Type.SHIP,
    isChecked: false
  },
  {
    offer: `Turn off internet`,
    cost: 1,
    type: Type.SHIP,
    isChecked: false
  },
  {
    offer: `Use the horn`,
    cost: 430,
    type: Type.SHIP,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 40,
    type: Type.TRANSPORT,
    isChecked: false
  },
  {
    offer: `Use helicopter`,
    cost: 500,
    type: Type.TRANSPORT,
    isChecked: false
  },
  {
    offer: `Rent a car`,
    cost: 140,
    type: Type.DRIVE,
    isChecked: false
  },
  {
    offer: `Add luggage`,
    cost: 50,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 80,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    offer: `Add meal`,
    cost: 15,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    offer: `Choose seats`,
    cost: 5,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    offer: `Travel by train`,
    cost: 40,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    offer: `Add breakfast`,
    cost: 50,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    offer: `Switch to comfort`,
    cost: 80,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    offer: `Breakfast to the bed`,
    cost: 60,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    offer: `Book tickets`,
    cost: 40,
    type: Type.SIGHTSEEING,
    isChecked: false
  },
  {
    offer: `Lunch in city`,
    cost: 30,
    type: Type.SIGHTSEEING,
    isChecked: false
  },
  {
    offer: `Add breakfast`,
    cost: 40,
    type: Type.RESTAURANT,
    isChecked: false
  },
  {
    offer: `Taste the best dish`,
    cost: 250,
    type: Type.RESTAURANT,
    isChecked: false
  },
  {
    offer: `Add dinner`,
    cost: 77,
    type: Type.RESTAURANT,
    isChecked: false
  },
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

const generateType = () => getRandomArrayElement(Object.values(Type));

export const generateCity = () => getRandomArrayElement(CITIES);

export const generateRandomDescription = () => {
  return shuffleArray(DESCRIPTIONS)
  .slice(0, 5)
  .slice(0, Math.random() * DESCRIPTIONS.length + 1)
  .join(``);
};

export const Time = {
  DAY_GAP: 10,
  HOUR_GAP: 20,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
  MILLISECONDS: 1000
};

export const getRandomSchedule = () => {
  const start = new Date(Date.now() - getAnyRandomInteger(Time.HOURS * Time.MINUTES * Time.SECONDS * Time.MILLISECONDS, Time.DAY_GAP * Time.HOURS * Time.MINUTES * Time.SECONDS * Time.MILLISECONDS));
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


export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getAdditionalsByType = (type) => {
  return ADDITIONALS.filter((item) => item.type === type)
    .map((item) => {
      item.isChecked = generateRandomBoolean();
      return item;
    });
};

export const generateTripPoint = () => {
  const generateTypes = generateType();
  return {
    id: generateId(),
    type: generateTypes,
    city: generateCity(),
    additionals: getAdditionalsByType(generateTypes),
    pointInfo: {
      description: generateRandomDescription(),
      photo: `http://picsum.photos/248/152?r`
    },
    schedule: getRandomSchedule(),
    price: getRandomInteger(Price.MIN, Price.MAX),
    isFavorite: false,

  };
};

