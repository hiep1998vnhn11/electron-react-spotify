export const secondToTime = (second: number) => {
  const minute = Math.floor(second / 60);
  const second_ = second % 60;
  return `${minute < 10 ? `0${minute}` : minute}:${
    second_ < 10 ? `0${second_}` : second_
  }`;
};
