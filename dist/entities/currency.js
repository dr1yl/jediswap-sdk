import JSBI from 'jsbi';
import { SolidityType } from '../constants';
import { validateSolidityTypeInstance } from '../utils';
/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
class Currency {
    // public static readonly TOKEN0: Currency = new Currency(18, 'J23FEB0', 'Jedi23Feb 0 ')
    /**
     * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     * @param logoURI of the currency
     */
    constructor(decimals, symbol, name, logoURI) {
        validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8);
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
        this.logoURI = logoURI;
    }
}
/**
 * The only instance of the base class `Currency`.
 */
Currency.ETHER = new Currency(18, 'ETH', 'Ether');
export { Currency };
const ETHER = Currency.ETHER;
// const TOKEN0 = Currency.TOKEN0
export { ETHER };
//# sourceMappingURL=currency.js.map