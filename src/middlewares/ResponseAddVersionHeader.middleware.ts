import config from "@config";

export default (req, res, next) => {
  res.set("App-Version", config.app.version);
  next();
};
