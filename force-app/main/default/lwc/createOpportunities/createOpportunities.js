import { LightningElement, track, wire } from "lwc";
import getAccounts from "@salesforce/apex/CreateOpportunitiesController.getAccounts";

const accountsPerPage = 5;
const columns = [{ label: "Account Name", fieldName: "Name" }];

export default class CreateOpportunities extends LightningElement {
  columns = columns;
  @track page = 1;
  @track selectedAccountsMap = new Map();
  @track querySearch;
  @track accounts = [];
  @track number_pages;

  @track opportunityData = {};

  @wire(getAccounts, {
    page: '$page',
    recordsPerPage: accountsPerPage,
    querySearch: ''
  })
  wiredValue({ error, data }) {
    if (data) {
      this.accounts = data.accounts;
      this.number_pages = data.number_pages;
    } else if (error) {
      console.error(error);
    }
  }

  @track selectedRows = [];
  @track selectedAccounts = [];
/*   get selectedRows() {
     console.log('Selected rows: ' + [...this.selectedAccountsMap.keys()]);
   return [...this.selectedAccountsMap.keys()];
  }
  get selectedAccounts() {
    console.log('Selected accounts: ' + [...this.selectedAccountsMap.values()]);
    return [...this.selectedAccountsMap.values()];
  } */

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    console.log("Name: " + name);
    console.log("Value: " + value);
    this.opportunityData[name] = value;
  }

  handleRemoveEvent(event) {
    console.log("Remove account from child component with id " + event.detail);
    this.selectedAccountsMap.delete(event.detail);
    this.selectedRows=[...this.selectedAccountsMap.keys()];
    this.selectedAccounts=[...this.selectedAccountsMap.values()];
  }

  selectAccount(event) {
    const selectedRows = event.detail.selectedRows;
    // Display that fieldName of the selected rows
    let mapSelecteds = new Map();
    for (const row of selectedRows) {

        console.log("Selected "+row.Name+" with id " + row.Id);
        let selectedAccount = this.accounts.find(
          x => x.Id === row.Id
        );
        mapSelecteds.set(selectedAccount.Id, selectedAccount);
        console.log(this.selectedAccountsMap.size);

    }
    this.selectedAccountsMap=mapSelecteds;
    this.selectedRows=[...this.selectedAccountsMap.keys()];
    this.selectedAccounts=[...this.selectedAccountsMap.values()];
    console.log(JSON.parse(JSON.stringify(this.selectedAccounts)));
  }

  removeSelectedAccount(event) {
    console.log("Remove account with id " + event.target.dataset.item);
    this.selectedAccountsMap.delete(event.target.dataset.item);
  }

  first() {
    this.page = 1;
  }
  back() {
    this.page--;
  }
  next() {
    this.page++;
  }
  last() {
    this.page = this.number_pages;
  }

  get disabledBackwardButtons() {
    return this.page === 1;
  }
  get disabledForwardButtons() {
    return this.page === this.number_pages;
  }
}
