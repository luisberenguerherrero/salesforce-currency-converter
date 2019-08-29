import { LightningElement, track, wire } from "lwc";
import getAccounts from "@salesforce/apex/CreateOpportunitiesController.getAccounts";

const accountsPerPage = 5;

export default class CreateOpportunities extends LightningElement {
  @track page = 1;
  @track selectedAccounts = [];
  //@wire(getAccounts, {page: '$page', records: accountsPerPage}) accounts;

  selectAccount(event) {
    let selectedAccount = this.accounts.find(
      x => x.Id === event.target.dataset.item
    );
    this.selectedAccounts.push(selectedAccount);
  }

  removeSelectedAccount(event) {
    let indexToRemove = this.selectedAccounts.findIndex(
      x => x.Id === event.target.dataset.item
    );
    this.selectedAccounts.splice(indexToRemove);
  }

  first() {}
  back() {}
  next() {}
  last() {}

  disabledBackwardsButtons() {
    return this.page === 1;
  }
  disabledForwardButtons() {
    return this.page;
  }
}
