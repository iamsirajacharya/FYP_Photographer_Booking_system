exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Check if Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  // Check if Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      message: "Unique constraint error",
      errors,
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};
