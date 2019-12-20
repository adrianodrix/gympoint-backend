import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import config from "@config";

const darlingStandByMe = slowDown(config.req.slowDown);
const limiter = rateLimit(config.req.rateLimit);

export default [darlingStandByMe, limiter];
