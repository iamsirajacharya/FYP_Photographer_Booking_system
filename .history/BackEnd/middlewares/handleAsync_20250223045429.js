function handleAsync(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
    romise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = handleAsync;
