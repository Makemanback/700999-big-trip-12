export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
  NEW_EVENT: document.querySelector(`.trip-main__event-add-btn`)
};

export const StatsType = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPEND: `time-spend`
};

export const NonTravelPoint = {
  CHECK_IN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`
};
