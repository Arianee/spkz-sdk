/**
 * Helper like assert but work on web and nodejs
 * @param assertion
 * @param message
 */
export const required = (assertion, message) => {
  if (assertion !== true) {
    console.error('Error from required:', message);
    throw message;
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
  if (type === 'array') {
    return required(Array.isArray(variable), message);
  }
  return required((typeof variable).toString() === type, message);
};
