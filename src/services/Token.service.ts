import { encode, decode } from 'jwt-simple';
import config from '@config';
import { User, AuthInfo } from '@modules/Users/interfaces/User.interface';

class TokenService {
  private secret: string;
  private authInfo: AuthInfo;
  private jwtEncode: Function;
  private jwtDecode: Function;

  public constructor() {
    this.secret = config.app.secret;
    this.jwtEncode = encode;
    this.jwtDecode = decode;
  }

  public encode(userObject: User): string {
    this.authInfo = {
      userId: userObject.id,
      nbf: Date.now() / 1000,
      exp: Date.now() / 1000 + 60 * 30,
    };

    return this.jwtEncode(this.authInfo, this.secret);
  }

  public decode(token: string): AuthInfo {
    return this.jwtDecode(token, this.secret);
  }
}

export default new TokenService();
