// Generate JWT token
const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

res.status(200).json({
  user: {
    id: user.id,
    username: user.username,
  },
  token,
});
