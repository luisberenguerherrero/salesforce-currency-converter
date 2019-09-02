import { LightningElement, track, api } from "lwc";
import saveOpportunities from "@salesforce/apex/CreateOpportunitiesController.saveOpportunities";

export default class PreviewOpportunities extends LightningElement {
  @track opportunitiesPreview = [];
  @track saveResults = [];
  errors = 0;
  successes = 0;
  @track showPopup = false;
  @api
  get opportunityData() {
    return this._opportunityData;
  }
  set opportunityData(value) {
    this._opportunityData = value;
    this.loadPreviewOpportunities();
  }

  @api stylePreview;
  @api
  get accounts() {
    return this._accounts;
  }
  //Every time new parameters are received, we load Policies from the ICVC
  set accounts(value) {
    this._accounts = value;
    this.loadPreviewOpportunities();
  }

  loadPreviewOpportunities() {
    if (this.accounts) {
      let newOpportunities = [];
      for (const account of this.accounts) {
        newOpportunities.push({
          AccountId: account.Id,
          Name: "New auto opportunity created for " + account.Name,
          Amount: this.opportunityData.amount,
          StageName: this.opportunityData.stage,
          CloseDate: this.opportunityData.date
        });
      }
      this.opportunitiesPreview = newOpportunities;
    }
  }

  removeAccount(event) {
    const removeEvent = new CustomEvent("remove", {
      detail: [event.target.dataset.item]
    });
    this.dispatchEvent(removeEvent);
  }

  handleClick() {
    saveOpportunities({ opportunities: this.opportunitiesPreview })
      .then(result => {
        this.saveResults = result;
        const errorData = result.filter(x => !x.success);
        this.errors = errorData.length;
        this.successes = result.length - this.errors;
        this.showPopup = true;
        console.log("SUCCESSES: " + this.successes);
        console.log("ERRORS: " + this.errors);
      })
      .catch(error => {
        console.error(error);
      });
    //handle creation
    //on creation, show a pop up with details (% on success inserts, and fail details)
    //on close pop up, remain bad insertions with their error message and a button to retry insert
    //if all success, empty selected accounts
  }

  onClosePopup() {
    let errorPreview = [];
    let successPreview = [];
    // eslint-disable-next-line guard-for-in
    for (const i in this.saveResults) {
      let row = this.opportunitiesPreview[i];
      if (!this.saveResults[i].success) {
        row.error = this.saveResults[i].error;
        errorPreview.push(row);
      } else if (this.saveResults[i].success) {
        successPreview.push(this.opportunitiesPreview[i].AccountId);
      }
    }
    this.opportunitiesPreview = errorPreview;

    const removeEvent = new CustomEvent("remove", {
      detail: successPreview
    });
    this.dispatchEvent(removeEvent);

    this.showPopup = false;
  }

  get errorMessage() {
    if (this.errors === 0) {
      return false;
    } else if (this.errors === 1) {
      return "1 Opportunity couldn't be created";
    }
    return `${this.errors} Opportunities couldn't be created`;
  }

  get successMessage() {
    if (this.successes === 0) {
      return false;
    } else if (this.successes === 1) {
      return "1 Opportunity created successfully";
    }
    return `${this.successes} Opportunities created successfully`;
  }

  get emptyAccounts() {
    if (!this.accounts) {
      return true;
    } else if (this.accounts.length === 0) {
      return true;
    }
    return false;
  }
}
