import { Request, Response, NextFunction } from 'express';
import TokenService from '@services/Token.service';
import { HttpException } from '@classes';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const [, token] = authorization.split(' ');

    const data = TokenService.decode(token);
    req.user = data.user;

    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};
