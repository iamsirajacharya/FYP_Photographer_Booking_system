function handleAsync(fn) {
  return async (req, res, next) => {
    try {
      const result = await fn(req, res);
      if (!result) next();
      else res.status(400).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = handleAsync;
