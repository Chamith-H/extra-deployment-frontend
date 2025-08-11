import moment from "moment-timezone";

export const dateFetcher = (date: string) => {
  // Get device's current timezone
  const currentTimezone = moment.tz.guess();

  // Convert and format
  if (date !== "") {
    return moment(date).tz(currentTimezone).format("YYYY-MM-DD | HH:mm");
  } else {
    return moment().tz(currentTimezone).format("YYYY-MM-DD | HH:mm");
  }
};

export const dateTimeGetter = (date: string) => {
  // Get device's current timezone
  const currentTimezone = moment.tz.guess();

  // Convert and format
  const dateF = moment(date).tz(currentTimezone).format("YYYY-MM-DD");
  const timeF = moment(date).tz(currentTimezone).format("HH:mm");

  return {
    f_date: dateF,
    f_time: timeF,
  };
};
