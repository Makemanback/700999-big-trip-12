import {getRandomInteger, shuffleArray, getRandomProperty} from '../utils.js';

const generateType = () => {
  const type = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Restaurant`];

  const randomType = getRandomInteger(0, type.length - 1);

  return type[randomType];
};

export const generateCity = () => {
  const city = [`Amsterdam`, `Dublin`, `London`, `Rome`, `Paris`, `Berlin`];

  const randomCity = getRandomInteger(0, city.length - 1);

  return city[randomCity];
};

export const generateRandomAdditional = () => {
  const additional = {
    taxi: `Order Uber`,
    luggage: `Add luggage`,
    plane: `Switch to comfort`,
    car: `Rent a car`,
    restaraunt: `Add breakfast`
  };

  const randomAdditional = getRandomProperty(additional);

  return randomAdditional;
};

const generateRandomDescription = () => {
  const description = [
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

  const randomDescription = shuffleArray(description)
                            .slice(0, 5)
                            .slice(0, Math.random() * description.length + 1)
                            .join(``);

  return randomDescription;
};

const getRandomSchedule = () => {

  const schedule = {
    first: {
      start: new Date(),
      end: new Date()
    },
    second: {
      start: new Date(),
      end: new Date()
    },
    third: {
      start: new Date(),
      end: new Date()
    }
  };

  schedule.first.start.setHours(20, 0, 0, 0);
  schedule.first.end.setHours(22, 0, 0, 0);

  schedule.second.start.setHours(20, 0, 0, 0);
  schedule.second.end.setHours(20, 30, 0, 0);

  schedule.third.start.setHours(20, 0, 0, 0);
  schedule.third.end.setHours(21, 30, 0, 0);

  const randomSchedule = getRandomProperty(schedule);

  return randomSchedule;
};

export const {start, end} = getRandomSchedule();

const getTimeGap = () => {

  const deviation = 1000 * 60 * 60;
  const timeGap = new Date(end - start - deviation);

  const stringGap = timeGap.toLocaleString(`ru-RU`, {hour: `numeric`, minute: `numeric`});
  const arrowGap = Array.from(stringGap);
  const setTimeGap = (arr) => {
    let colon;
    if (arr[0] === `0` && arr[1] !== `0`) {
      arr.shift();
    }

    if (arr[0] === `0` && arr[1] === `0`) {
      arr.shift();
      arr.shift();
      if (arr[1] === `0`) {
        arr.shift();
        arr.shift();
      } else {
        colon = arr.indexOf(`:`);
        arr[colon] = ``;
      }
      arr.push(`M`);
    }

    if (arr[arr.length - 1] === `0` && arr[arr.length - 2] === `0`) {
      arr.pop();
      arr.pop();
      colon = arr.indexOf(`:`);
      arr[colon] = `H`;
    }

    if (arr.length >= 4 && arr[arr.length - 1] !== `M`) {
      colon = arr.indexOf(`:`);
      arr[colon] = `H `;
      arr.push(`M`);
    }

    return arr.join(``);
  };

  return setTimeGap(arrowGap);
};

const startTime = start.toLocaleString(`ru-RU`, {hour: `numeric`, minute: `numeric`});
const endTime = end.toLocaleString(`ru-RU`, {hour: `numeric`, minute: `numeric`});

const generateRandomPrice = () => {
  const price = [`20`, `50`, `100`];

  const randomPrice = getRandomInteger(0, price.length - 1);

  return price[randomPrice];
};

export const generateRandomCost = () => {
  const cost = [`25`, `40`, `150`, `70`];

  const randomCost = getRandomInteger(0, cost.length - 1);

  return cost[randomCost];
};

export const generateTripPoint = () => {
  return {
    type: generateType(),
    city: generateCity(),
    additional: {
      description: generateRandomAdditional(),
      cost: generateRandomCost()
    },
    pointInfo: {
      description: generateRandomDescription(),
      photo: `http://picsum.photos/248/152?r`
    },
    schedule: {
      startTime,
      endTime,
      timeGap: getTimeGap(),
    },
    price: generateRandomPrice()
  };
};
