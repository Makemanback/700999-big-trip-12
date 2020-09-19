export const Time = {
  DAY_GAP: 10,
  HOUR_GAP: 20,
  HOURS: 24,
  MINUTES: 60,
  SECONDS: 60,
  MILLISECONDS: 1000
};

export const Type = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const StatsType = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPEND: `time-spend`
};


export const NonTravelPoints = [Type.CHECK_IN, Type.SIGHTSEEING, Type.RESTAURANT];
export const BAR_HEIGHT = 55;

export const ActionIcon = {
  [Type.TAXI]: `🚕 TAXI`,
  [Type.BUS]: `🚌 BUS`,
  [Type.TRAIN]: `🚂 TRAIN`,
  [Type.SHIP]: `🚢 SHIP`,
  [Type.TRANSPORT]: `🚙 TRANSPORT`,
  [Type.DRIVE]: `🚗 DRIVE`,
  [Type.FLIGHT]: `✈️ FLIGHT`,
  [Type.CHECK_IN]: `🏨 CHECK-IN`,
  [Type.SIGHTSEEING]: `🏛 SIGHTSEEING`,
  [Type.RESTAURANT]: `🍴 RESTAURANT`
};

export const SHAKE_ANIMATION_TIMEOUT = 600;
