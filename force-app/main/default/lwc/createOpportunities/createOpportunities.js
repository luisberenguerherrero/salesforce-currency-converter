import { LightningElement, track } from "lwc";

export default class CreateOpportunities extends LightningElement {
  @track page = 1;
  @track selectedAccountsMap = new Map();
  @track selectedRows = [];
  @track selectedAccounts = [];

  @track paginating = false;

  @track pageSnapshot = [];
  @track querySearch;
  @track accounts = [];
  @track number_pages;

  @track opportunityData = {};

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

  handleUpdateEvent(event) {
    /*     console.log(JSON.parse(JSON.stringify([...event.detail.map.keys()])));
    console.log(JSON.parse(JSON.stringify(event.detail.selectedAccounts)));
 */ console.log(
      "Updating the map"
    );
    this.selectedAccountsMap = event.detail.map;
    this.selectedAccounts = event.detail.selectedAccounts;
  }

  handleRemoveEvent(event) {
    console.log("Remove account from child component with id " + event.detail);
    let map = new Map(this.selectedAccountsMap);
    console.log(JSON.parse(JSON.stringify([...map.keys()])));
    map.delete(event.detail);
    console.log(JSON.parse(JSON.stringify([...map.keys()])));
    this.selectedAccountsMap = map;
    this.selectedRows = [...this.selectedAccountsMap.keys()];
    this.selectedAccounts = [...this.selectedAccountsMap.values()];
  }

  /*   removeSelectedAccount(event) {
    console.log("Remove account with id " + event.target.dataset.item);
    this.selectedAccountsMap.delete(event.target.dataset.item);
  }
 */
}
