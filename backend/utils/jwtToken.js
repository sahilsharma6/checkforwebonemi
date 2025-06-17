import config from "../config/config.js";

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  if (!token) {
    return next(new ErrorHandler("User not found", 404));
  }

  console.log(token);
  const options = {
    expires: new Date(Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
