import { LightningElement, track, wire } from "lwc";
import getAccounts from "@salesforce/apex/CreateOpportunitiesController.getAccounts";

const accountsPerPage = 5;

const columns = [
  { label: 'Account Name', fieldName: 'name' }/* ,
  { label: 'Website', fieldName: 'website', type: 'url' },
  { label: 'Phone', fieldName: 'phone', type: 'phone' },
  { label: 'Balance', fieldName: 'amount', type: 'currency' },
  { label: 'CloseAt', fieldName: 'closeAt', type: 'date' }, */
];

export default class CreateOpportunities extends LightningElement {
  @track page = 1;
  @track selectedAccounts = [];
  //@wire(getAccounts, {page: '$page', records: accountsPerPage}) accounts;


    @track data = [{
      id: 'a',
      name: 'name fro maugustus quo throug north quay london brie cheese name fro maugustus quo throug north quay london brie cheese name fro maugustus quo throug north quay london brie cheese',
      email: 'email',
      website: 'url',
      amount: 'currency',
      phone: 'phoneNumber',
      closeAt: 'dateInFuture'
    },{
      id: 'b',
      name: 'name',
      email: 'email',
      website: 'url',
      amount: 'currency',
      phone: 'phoneNumber',
      closeAt: 'dateInFuture'
    },{
      id: 'c',
      name: 'name',
      email: 'email',
      website: 'url',
      amount: 'currency',
      phone: 'phoneNumber',
      closeAt: 'dateInFuture'
    },{
      id: 'd',
      name: 'name',
      email: 'email',
      website: 'url',
      amount: 'currency',
      phone: 'phoneNumber',
      closeAt: 'dateInFuture'
    },{
      id: 'e',
      name: 'name',
      email: 'email',
      website: 'url',
      amount: 'currency',
      phone: 'phoneNumber',
      closeAt: 'dateInFuture'
    }];
    @track columns = columns;

    @track selectedAccounts = new Map();

    get selectedRows(){
      return [ ...this.selectedAccounts.keys() ];
    }

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

  disabledBackwardButtons() {
    return this.page === 1;
  }
  disabledForwardButtons() {
    return this.page;
  }
}
