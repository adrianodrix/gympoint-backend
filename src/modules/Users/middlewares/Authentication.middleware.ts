import { Request, Response, NextFunction } from 'express';
import TokenService from '@services/Token.service';
import UserModel from '@modules/Users/models/User.schema';
import { User } from '@modules/Users/interfaces/User.interface';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: req.__('token.notProvided') });
    }

    const parts = authorization.split(' ');
    const [scheme, token] = parts;

    if (parts.length !== 2 || !/^Bearer$/i.test(scheme))
      return res.status(401).send({ message: req.__('token.malformatted') });

    const authInfo = TokenService.decode(token);

    const user: User = await UserModel.findOne({ _id: authInfo.userId });
    if (!user) {
      return res.status(401).json({ message: req.__('user.notExists') });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: req.__('token.invalid') });
  }
};
