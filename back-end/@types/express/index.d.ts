import ITokenData from '../../src/components/auth/dto/ITokenData.inferface';

declare global {
    namespace Express {
        interface Request {
            authorized?: ITokenData | null;
        }
    }
}