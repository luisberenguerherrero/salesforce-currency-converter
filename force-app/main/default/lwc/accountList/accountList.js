import { LightningElement, track, api, wire } from "lwc";
import getAccounts from "@salesforce/apex/CreateOpportunitiesController.getAccounts";

const accountsPerPage = 5;
const columns = [{ label: "Account Name", fieldName: "Name" }];

export default class AccountList extends LightningElement {
  columns = columns;
  isRenderCallbackActionExecuted = false;
  @track page = 1;
  @track selectedRows = [];
  @track accounts = [];
  @track number_pages;

  @api
  get selectedAccountsMap() {
    return this._selectedAccountsMap;
  }
  set selectedAccountsMap(value) {
    this._selectedAccountsMap = value;
    this.selectedRows = [...this._selectedAccountsMap.keys()];
  }

  @wire(getAccounts, {
    page: "$page",
    recordsPerPage: accountsPerPage,
    querySearch: ""
  })
  wiredValue({ error, data }) {
    if (data) {
      this.accounts = data.accounts;
      this.number_pages = data.number_pages;
    } else if (error) {
      console.error(error);
    }
  }

  selectAccount(event) {
    this.isRenderCallbackActionExecuted = false;
    if (!this.paginating) {
      const selectedRows = event.detail.selectedRows;

      this.accounts.forEach(account => {
        if (selectedRows.findIndex(x => x.Id === account.Id) >= 0) {
          this.selectedAccountsMap.set(account.Id, account);
        } else {
          this.selectedAccountsMap.delete(account.Id);
        }
      });
    }

    this.selectedRows = [...this.selectedAccountsMap.keys()];
    const update = new CustomEvent("update", {
      detail: {
        map: this.selectedAccountsMap,
        selectedAccounts: [...this.selectedAccountsMap.values()]
      }
    });
    this.dispatchEvent(update);
  }

  renderedCallback() {
    if (this.isRenderCallbackActionExecuted) {
      this.paginating = false;
      return;
    }
    this.isRenderCallbackActionExecuted = true;
    this.selectedRows = [...this.selectedAccountsMap.keys()];
  }

  first() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.page = 1;
  }
  back() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.page--;
  }
  next() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.page++;
  }
  last() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.page = this.number_pages;
  }

  get disabledBackwardButtons() {
    return this.page === 1;
  }
  get disabledForwardButtons() {
    return this.page === this.number_pages;
  }
}
