import { LightningElement, api, wire, track } from "lwc";
//import getAllAccount from "@salesforce/apex/AccountContactRelationController.getAllAccount";
import getRolesListValues from "@salesforce/apex/AccountContactRelationController.getRolesListValuesIntoList";
export default class AccountContactRelation extends LightningElement {
  @api recordId;
  @track mapRolesData = [];
  @track selectedRoles = [];
  isLoaded = false;

  @wire(getRolesListValues)
  rolesList({ data, error }) {
    if (data) {
      let mapVal = [];
      data.forEach((element) => {
        mapVal.push({ label: element, value: element });
      });
      this.mapRolesData = mapVal;
      //this.oldMapData = [...mapVal];
      console.log("this.mapRolesData==>", this.mapRolesData);
    }
    if (error) {
      console.log(` Error while fetching Picklist values  ${error}`);
      this.error = error;
    }
  }

  handleRoleChange(event) {
    this.selectedRoles = event.detail.value;
    console.log("this.selected==>", this.selectedRoles);
  }

  // To call the child component method to add the Contact into the list.
  saveContactAccountRelation(event) {
    this.isLoaded = true;
    console.log("this.selectedRoles.selectedRoles==>" + this.selectedRoles);
    const objChild = this.template.querySelector(
      "c-account-multi-select-lookup"
    );
    objChild.addSelectedRoles(this.selectedRoles);
  }
  handleSpinner(event) {
    console.log("event.detail===>", event.detail);
    this.isLoaded = event.detail;
  }

  handleCancelModal() {
    this.dispatchEvent(
      new CustomEvent("closemodal", {
        detail: {}
      })
    );
  }
}
