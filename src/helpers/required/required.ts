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

/**
 * Requires variable to be defined
 * @param variable
 * @param message
 */
export const requiredDefined = (variable, message) => {
  return required(variable !== null && variable !== undefined, message);
};

/**
 * Required type of variable
 * @param variable
 * @param {string} type
 * @param message
 */
export const requiredType = (variable, type:string, message) => {
  return required((typeof variable).toString() === type, message);
};
