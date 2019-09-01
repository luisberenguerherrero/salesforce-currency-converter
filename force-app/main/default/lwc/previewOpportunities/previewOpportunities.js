import { LightningElement, track, api } from "lwc";

export default class PreviewOpportunities extends LightningElement {
    @track opportunitiesPreview = [];
    @api pageChanged;
    @api opportunityData;
    @api
    get accounts() {
        return this._accounts;
    }
    //Every time new parameters are received, we load Policies from the ICVC
    set accounts(value) {
      console.log('updated value');
      console.log(JSON.parse(JSON.stringify(value)));
        this._accounts = value;
        if (this._accounts != null) {
            let newOpportunities = [];
            for (const account of this._accounts) {
                newOpportunities.push({
                    AccountId: account.Id,
                    Name: "New auto opportunity created for " + account.Name,
                    Amount: this.opportunityData.amount,
                    Stage: this.opportunityData.stage,
                    CloseDate: this.opportunityData.date
                });

            }
            this.opportunitiesPreview=newOpportunities;
        }
        console.log(JSON.parse(JSON.stringify(this.opportunitiesPreview)));

    }


  removeAccount(event) {
    const removeEvent = new CustomEvent("remove", {
      detail: event.target.dataset.item
    });
    this.dispatchEvent(removeEvent);
  }

  handleClick() {
    //handle creation
    //on creation, show a pop up with details (% on success inserts, and fail details)

    //on close pop up, remain bad insertions with their error message and a button to retry insert

    //if all success, empty selected accounts
  }
}
