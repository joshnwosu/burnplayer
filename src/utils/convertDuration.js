const convertDuration = (length) => {
  let seconds = Math.floor(length % 60) || 0;
  let minutes = Math.floor(length / 60) || 0;
  let hours = Math.floor(minutes / 60) || 0;

  hours %= 24;
  minutes %= 60;
  seconds %= 60;

  seconds = seconds <= 9 ? '0' + seconds : seconds;
  minutes = minutes <= 9 ? '0' + minutes : minutes;
  hours = hours <= 9 ? '0' + hours : hours;

  return length >= 3600
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
};

export default convertDuration;
