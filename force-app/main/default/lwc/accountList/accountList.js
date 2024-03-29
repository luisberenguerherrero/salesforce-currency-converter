import { LightningElement, track, api, wire } from "lwc";
import getAccounts from "@salesforce/apex/CreateOpportunitiesController.getAccounts";

const accountsPerPage = 5;
const columns = [{ label: "Account Name", fieldName: "Name" }];

const SEARCH_DELAY = 300;
export default class AccountList extends LightningElement {
  columns = columns;
  isRenderCallbackActionExecuted = false;
  page = 1;
  querySearch = "";
  @track selectedRows = [];
  accounts = [];
  number_pages = 1;
  @track loading = true;

  inputValue;

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
    querySearch: "$querySearch"
  })
  wiredValue({ error, data }) {
    if (data) {
      this.accounts = data.accounts;
      this.number_pages = data.number_pages;
      this.selectedRows = [...this.selectedAccountsMap.keys()];
      this.loading = false;
    } else if (error) {
      console.error(error);
    }
  }
  handleFilter(event) {
    this.inputValue = event.target.value;
    if (this.inputValue.length === 0) {
      this.paginating = true;
      this.isRenderCallbackActionExecuted = false;
      this.loading = true;
      this.page = 1;
      this.querySearch = "";
    } else {
      // Apply search throttling (prevents search if user is still typing)
      if (this.searchThrottlingTimeout) {
        clearTimeout(this.searchThrottlingTimeout);
      }
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.searchThrottlingTimeout = setTimeout(() => {
        this.paginating = true;
        this.isRenderCallbackActionExecuted = false;
        this.loading = true;
        this.page = 1;
        this.querySearch = this.inputValue;
        this.searchThrottlingTimeout = null;
      }, SEARCH_DELAY);
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
    this.loading = true;
    this.page = 1;
  }
  back() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.loading = true;
    this.page--;
  }
  next() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.loading = true;
    this.page++;
  }
  last() {
    this.paginating = true;
    this.isRenderCallbackActionExecuted = false;
    this.loading = true;
    this.page = this.number_pages;
  }

  get disabledBackwardButtons() {
    return this.loading || this.page === 1;
  }
  get disabledForwardButtons() {
    return this.loading || this.page === this.number_pages;
  }
}
