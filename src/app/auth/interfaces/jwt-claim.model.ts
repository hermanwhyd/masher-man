export class JwtClaim {
  sub: string;
  name: string;
  nip: string;
  iat: number;
  exp: number;
  roles: string[];

  public get username() {
    return this.nip;
  }
}
