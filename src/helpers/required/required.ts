/**
 * Helper like assert but work on web and nodejs
 * @param assertion
 * @param message
 */
export const required = (assertion, message) => {
  if (assertion !== true) {
    throw new Error(message);
  }
};

export const requiredDefined = (variable, message) => {
  return required(variable !== null && variable !== undefined, message);
};
