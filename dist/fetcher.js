import { Contract, Provider } from 'starknet';
import { TokenAmount } from './entities/fractions/tokenAmount';
import { Pair } from './entities/pair';
import PairAbi from './abis/PairAbi.json';
import invariant from 'tiny-invariant';
import ERC20 from './abis/ERC20.json';
import { ChainId } from './constants';
import { Token } from './entities/token';
const NetworkNames = {
    [ChainId.MAINNET]: 'mainnet-alpha',
    [ChainId.ROPSTEN]: 'goerli-alpha',
    [ChainId.RINKEBY]: 'goerli-alpha',
    [ChainId.GÖRLI]: 'goerli-alpha',
    [ChainId.KOVAN]: 'goerli-alpha'
};
let TOKEN_DECIMALS_CACHE = {
    [ChainId.ROPSTEN]: {
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18 // ETH
    },
    [ChainId.RINKEBY]: {
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18 // ETH
    },
    [ChainId.GÖRLI]: {
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18 // ETH
    },
    [ChainId.KOVAN]: {
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18 // ETH
    }
};
async function getDecimals(chainId, address, provider) {
    var _a;
    if (typeof ((_a = TOKEN_DECIMALS_CACHE === null || TOKEN_DECIMALS_CACHE === void 0 ? void 0 : TOKEN_DECIMALS_CACHE[chainId]) === null || _a === void 0 ? void 0 : _a[address]) === 'number') {
        return TOKEN_DECIMALS_CACHE[chainId][address];
    }
    const contract = new Contract(ERC20, address, provider);
    const { decimals } = await contract.call('decimals');
    TOKEN_DECIMALS_CACHE = {
        ...TOKEN_DECIMALS_CACHE,
        [chainId]: {
            ...TOKEN_DECIMALS_CACHE === null || TOKEN_DECIMALS_CACHE === void 0 ? void 0 : TOKEN_DECIMALS_CACHE[chainId],
            [address]: decimals.toNumber()
        }
    };
    return decimals.toNumber();
}
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
export class Fetcher {
    /**
     * Cannot be constructed.
     */
    constructor() { }
    /**
     * Fetch information for a given token on the given chain, using the given ethers provider.
     * @param chainId chain of the token
     * @param address address of the token on the chain
     * @param provider provider used to fetch the token
     * @param symbol optional symbol of the token
     * @param name optional name of the token
     */
    static async fetchTokenData(chainId, address, provider = new Provider({ sequencer: { network: NetworkNames[chainId] } }), symbol, name) {
        const parsedDecimals = await getDecimals(chainId, address, provider);
        return new Token(chainId, address, parsedDecimals, symbol, name);
    }
    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */
    static async fetchPairData(tokenA, tokenB, provider = new Provider({ sequencer: { network: NetworkNames[tokenA.chainId] } })) {
        invariant(tokenA.chainId === tokenB.chainId, 'CHAIN_ID');
        const address = Pair.getAddress(tokenA, tokenB);
        const { reserve0, reserve1 } = await new Contract(PairAbi, address, provider).call('getReserves', []);
        const balances = tokenA.sortsBefore(tokenB) ? [reserve0, reserve1] : [reserve0, reserve1];
        return new Pair(new TokenAmount(tokenA, balances[0].toString()), new TokenAmount(tokenB, balances[1].toString()));
    }
}
//# sourceMappingURL=fetcher.js.map