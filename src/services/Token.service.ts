import { encode, decode } from 'jwt-simple';
import config from '@config';
import { consoleSandbox } from '@sentry/utils';

class TokenService {
  private secret: string;
  private jwtEncode: Function;
  private jwtDecode: Function;

  public constructor() {
    this.secret = config.app.secret;
    this.jwtEncode = encode;
    this.jwtDecode = decode;
  }

  public encode(userObject: object): string {
    let expires = Date.now() / 1000 + 60 * 30;
    let nbf = Date.now() / 1000;

    return this.jwtEncode(
      {
        user: userObject,
        nbf: nbf,
        exp: expires,
      },
      this.secret
    );
  }

  public decode(token: string): object {
    return this.jwtDecode(token, this.secret);
  }
}

export default new TokenService();
