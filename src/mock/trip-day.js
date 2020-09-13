import {getRandomInteger, getRandomArrayElement, generateRandomBoolean, getAnyRandomInteger} from '../utils/common.js';


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
    title: `Order Uber`,
    price: 20,
    type: Type.TAXI,
    isChecked: false
  },
  {
    title: `Turn off music`,
    price: 10,
    type: Type.TAXI,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 40,
    type: Type.TAXI,
    isChecked: false
  },
  {
    title: `Add luggage`,
    price: 20,
    type: Type.BUS,
    isChecked: false
  },
  {
    title: `Switch on conditioner`,
    price: 55,
    type: Type.BUS,
    isChecked: false
  },
  {
    title: `Open the window`,
    price: 7,
    type: Type.BUS,
    isChecked: false
  },
  {
    title: `Add breakfast`,
    price: 70,
    type: Type.TRAIN,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 45,
    type: Type.TRAIN,
    isChecked: false
  },
  {
    title: `Pass the station`,
    price: 15,
    type: Type.BUS,
    isChecked: false
  },
  {
    title: `Add luggage`,
    price: 40,
    type: Type.SHIP,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 30,
    type: Type.SHIP,
    isChecked: false
  },
  {
    title: `Turn off internet`,
    price: 1,
    type: Type.SHIP,
    isChecked: false
  },
  {
    title: `Use the horn`,
    price: 430,
    type: Type.SHIP,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 40,
    type: Type.TRANSPORT,
    isChecked: false
  },
  {
    title: `Use helicopter`,
    price: 500,
    type: Type.TRANSPORT,
    isChecked: false
  },
  {
    title: `Rent a car`,
    price: 140,
    type: Type.DRIVE,
    isChecked: false
  },
  {
    title: `Add luggage`,
    price: 50,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 80,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    title: `Add meal`,
    price: 15,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    title: `Choose seats`,
    price: 5,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    title: `Travel by train`,
    price: 40,
    type: Type.FLIGHT,
    isChecked: false
  },
  {
    title: `Add breakfast`,
    price: 50,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    title: `Switch to comfort`,
    price: 80,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    title: `Breakfast to the bed`,
    price: 60,
    type: Type.CHECK_IN,
    isChecked: false
  },
  {
    title: `Book tickets`,
    price: 40,
    type: Type.SIGHTSEEING,
    isChecked: false
  },
  {
    title: `Lunch in city`,
    price: 30,
    type: Type.SIGHTSEEING,
    isChecked: false
  },
  {
    title: `Add breakfast`,
    price: 40,
    type: Type.RESTAURANT,
    isChecked: false
  },
  {
    title: `Taste the best dish`,
    price: 250,
    type: Type.RESTAURANT,
    isChecked: false
  },
  {
    title: `Add dinner`,
    price: 77,
    type: Type.RESTAURANT,
    isChecked: false
  },
];

export const DESTINATIONS = [
  {
    description: `Amsterdam Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    name: `Amsterdam`,
    pictures: [
      {
        description: `Cafe`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Park`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Town`,
        src: `http://picsum.photos/248/152?r`,
      },
    ]
  },

  {
    description: `Dublin Cras aliquet varius magna, non porta ligula feugiat eget.`,
    name: `Dublin`,
    pictures: [
      {
        description: `Museum`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Bar`,
        src: `http://picsum.photos/248/152?r`,
      },
    ]
  },

  {
    description: `Paris Fusce tristique felis at fermentum pharetra.`,
    name: `Paris`,
    pictures: [
      {
        description: `River`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Beach`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Concert Hall`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Jail`,
        src: `http://picsum.photos/248/152?r`,
      },
    ]
  },

  {
    description: `Rome Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    name: `Rome`,
    pictures: [
      {
        description: `Coliseum`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Big Theatre`,
        src: `http://picsum.photos/248/152?r`,
      },
      {
        description: `Pigeon`,
        src: `http://picsum.photos/248/152?r`,
      },
    ]
  },
];
const generateType = () => getRandomArrayElement(Object.values(Type));

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

export const getDescription = (description) => DESTINATIONS.find((item) => item.name === description).description;
export const getPictures = (photos) => DESTINATIONS.find((item) => item.name === photos).pictures;

export const generateTripPoint = () => {
  const generateTypes = generateType();
  return {
    id: generateId(),
    type: generateTypes,
    additionals: getAdditionalsByType(generateTypes),
    schedule: getRandomSchedule(),
    price: getRandomInteger(Price.MIN, Price.MAX),
    isFavorite: false,
    destination: getRandomArrayElement(DESTINATIONS)
  };
};

