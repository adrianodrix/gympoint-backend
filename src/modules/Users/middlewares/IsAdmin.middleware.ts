import { Request, Response, NextFunction } from 'express';
import { User } from '@sentry/node';

class isAdmin {
  public handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = <User>req.user;

    if (!user.admin) {
      return res.status(406).json({
        message: 'user does not have permission for this feature',
      });
    }

    next();
  };
}

export default new isAdmin().handle;
