export interface IJWTPayLoad {
    user: IUserJWT;
    iat: number;
    exp: number;
}

export interface IUserJWT {
    email: string;
    username: string;
}