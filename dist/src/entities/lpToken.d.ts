import { ChainId } from '../constants';
import { Token } from './token';
export declare class LPToken extends Token {
    token0: Token;
    token1: Token;
    constructor(chainId: ChainId, token0: Token, token1: Token, address: string);
}
