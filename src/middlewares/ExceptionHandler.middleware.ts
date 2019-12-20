import Youch from 'youch';

export default async (err, req, res, next) => {
  res.statusCode = 500;

  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();
    return res.json(errors);
  }

  return res.json({
    error: { message: 'Internal server error', ...res.sentry },
  });
};
