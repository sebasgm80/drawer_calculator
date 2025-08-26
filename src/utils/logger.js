export const logger = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

