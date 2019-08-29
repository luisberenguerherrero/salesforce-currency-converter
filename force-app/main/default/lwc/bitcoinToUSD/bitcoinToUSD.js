import { LightningElement, track, wire } from "lwc";
import getOneBitcoinUSDValue from "@salesforce/apex/BitcoinToUSDConvertor.getValueFromBitpay";

export default class BitcoinToUSD extends LightningElement {
  @wire(getOneBitcoinUSDValue)
  wiredValue({ error, data }) {
    if (data) {
      this.oneBitcoinUSDValue = data;
      this.error = undefined;
    } else if (error) {
      this.error = 'Unknown error';
      if (Array.isArray(error.body)) {
        this.error = error.body.map(e => e.message).join(', ');
      } else if (typeof error.body.message === 'string') {
        this.error = error.body.message;
      }
    }
  }
  @track oneBitcoinUSDValue;
  @track error;
  @track bitcoinValue = 1;
  @track usdValue = this.oneBitcoinUSDValue;

  handleUSDChange(event) {
    let usdInput = event.target.value;
    this.usdValue = usdInput;
    this.bitcoinValue = usdInput / this.oneBitcoinUSDValue;
  }

  handleBitcoinChange(event) {
    let bitcoinInput = event.target.value;
    this.bitcoinValue = bitcoinInput;
    this.usdValue = bitcoinInput * this.oneBitcoinUSDValue;
  }

  get oneUSDBitcoinValue() {
    return 1 / this.oneBitcoinUSDValue;
  }
}
