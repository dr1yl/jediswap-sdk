import { Token } from './token';
export class LPToken extends Token {
    constructor(chainId, token0, token1, address) {
        const tokens = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0];
        const lpSymbol = `${tokens[0].symbol}-${tokens[1].symbol}`;
        const lpName = `${tokens[0].name}/${tokens[1].name}`;
        super(chainId, address, 18, lpSymbol, lpName);
        this.token0 = tokens[0];
        this.token1 = tokens[1];
    }
}
//# sourceMappingURL=lpToken.js.map