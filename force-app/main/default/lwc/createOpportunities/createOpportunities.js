import { LightningElement, track, wire } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import OPPORTUNITY_OBJECT from "@salesforce/schema/Opportunity";
import STAGE_FIELD from "@salesforce/schema/Opportunity.StageName";

export default class CreateOpportunities extends LightningElement {
  @track selectedAccountsMap = new Map();
  @track selectedAccounts = [];
  @track opportunityData = {};

  @track opportunityData = {};
  @track stage;
  @track date;

  @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: STAGE_FIELD
  })
  StagePicklistValues;

  handleAmount(event) {
    let value = event.target.value;
    let data = { ...this.opportunityData };
    data.amount = value;
    this.opportunityData = data;
  }
  handleStage(event) {
    let value = event.target.value;
    let data = { ...this.opportunityData };
    data.stage = value;
    this.opportunityData = data;
  }
  handleDate(event) {
    let value = event.target.value;
    let data = { ...this.opportunityData };
    data.date = value;
    this.opportunityData = data;
  }

  handleUpdateEvent(event) {
    this.selectedAccountsMap = event.detail.map;
    this.selectedAccounts = event.detail.selectedAccounts;
  }

  handleRemoveEvent(event) {
    //console.log("Remove account from child component with id " + event.detail);
    let map = new Map(this.selectedAccountsMap);
    for (const id of event.detail) {
      map.delete(id);
    }
    this.selectedAccountsMap = map;
    this.selectedRows = [...this.selectedAccountsMap.keys()];
    this.selectedAccounts = [...this.selectedAccountsMap.values()];
  }

  showErrorsValidation() {
    const inputsValid = [...this.template.querySelectorAll('lightning-input')]
      .reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      }, true);
    const selectValid = [...this.template.querySelectorAll('lightning-combobox')]
      .reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      }, true);

  }

  get stylePreview() {
    let height = window.innerHeight - 500;
    return `height: ${height}px; min-height: 400px`;
  }
  get stylePreviewChild() {
    let height = window.innerHeight - 600;
    return `height: ${height}px; min-height: 250px`;
  }
}
