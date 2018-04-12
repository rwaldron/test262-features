module.exports = function(api) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push((error, result) => error ? reject(error) : resolve(result));
      api(...args);
    });
  };
};
