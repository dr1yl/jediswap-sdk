import invariant from 'tiny-invariant';
import { Token, WETH } from './token';
import { Price } from './fractions/price';
import { ETHER } from '..';
export class Route {
    constructor(pairs, input, output) {
        invariant(pairs.length > 0, 'PAIRS');
        invariant(pairs.every(pair => pair.chainId === pairs[0].chainId), 'CHAIN_IDS');
        invariant((input instanceof Token && pairs[0].involvesToken(input)) ||
            (input === ETHER && pairs[0].involvesToken(WETH[pairs[0].chainId])), 'INPUT');
        invariant(typeof output === 'undefined' ||
            (output instanceof Token && pairs[pairs.length - 1].involvesToken(output)) ||
            (output === ETHER && pairs[pairs.length - 1].involvesToken(WETH[pairs[0].chainId])), 'OUTPUT');
        const path = [input instanceof Token ? input : WETH[pairs[0].chainId]];
        for (const [i, pair] of pairs.entries()) {
            const currentInput = path[i];
            invariant(currentInput.equals(pair.token0) || currentInput.equals(pair.token1), 'PATH');
            const output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
            path.push(output);
        }
        this.pairs = pairs;
        this.path = path;
        this.midPrice = Price.fromRoute(this);
        this.input = input;
        this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
    }
    get chainId() {
        return this.pairs[0].chainId;
    }
}
//# sourceMappingURL=route.js.map