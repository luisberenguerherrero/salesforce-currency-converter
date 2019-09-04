import { LightningElement, track, api } from "lwc";
import saveOpportunities from "@salesforce/apex/CreateOpportunitiesController.saveOpportunities";

export default class PreviewOpportunities extends LightningElement {
  @track opportunitiesPreview = [];
  @track saveResults = [];
  @track loading = false;
  errors = 0;
  successes = 0;
  errorMessages = new Map();
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
          CloseDate: this.opportunityData.date,
          ErrorMessage: this.errorMessages.get(account.Id)
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
    if (!this.emptyAccounts) {
      if (!this.emptyParams) {
        this.loading = true;
        saveOpportunities({ opportunities: this.opportunitiesPreview })
          .then(result => {
            this.saveResults = result;
            const errorData = result.filter(x => !x.success);
            this.errors = errorData.length;
            this.successes = result.length - this.errors;
            this.showPopup = true;
            this.loading = false;
          })
          .catch(error => {
            console.error(error);
            this.loading = false;
          });
      } else {
        const validate = new CustomEvent("validate");
        this.dispatchEvent(validate);
      }
    }
  }

  onClosePopup() {
    let successPreview = [];
    // eslint-disable-next-line guard-for-in
    for (const i in this.saveResults) {
      if (!this.saveResults[i].success) {
        this.errorMessages.set(
          this.opportunitiesPreview[i].AccountId,
          this.saveResults[i].error
        );
      } else if (this.saveResults[i].success) {
        successPreview.push(this.opportunitiesPreview[i].AccountId);
        this.errorMessages.delete(this.opportunitiesPreview[i].AccountId);
      }
    }
    const removeEvent = new CustomEvent("remove", {
      detail: successPreview
    });
    this.dispatchEvent(removeEvent);

    this.showPopup = false;
  }

  /*   get hasOpportunitiesPreview(){
    return this.opportunitiesPreview && this.opportunitiesPreview.length>0;
  }
 */
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

  get emptyParams() {
    return (
      this.opportunityData.amount === "" ||
      !this.opportunityData.amount ||
      (this.opportunityData.stage === "" || !this.opportunityData.stage) ||
      (this.opportunityData.date === "" || !this.opportunityData.date)
    );
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
