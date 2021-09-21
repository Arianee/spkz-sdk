export const addDate = (number, operator, date = Date.now()):number => {
  switch (operator) {
    case 'days':
      return date + 1000 * 3600 * 24 * number;
    case 'seconds':
      return date + 1000 * number;
    case 'minutes':
      return date + 60 * 1000 * number;
  }
};
