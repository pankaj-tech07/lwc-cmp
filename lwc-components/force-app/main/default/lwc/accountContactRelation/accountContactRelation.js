import { LightningElement, api, wire, track } from "lwc";
//import getAllAccount from "@salesforce/apex/AccountContactRelationController.getAllAccount";
import getRolesListValues from "@salesforce/apex/AccountContactRelationController.getRolesListValuesIntoList";
export default class AccountContactRelation extends LightningElement {
  @api recordId;
  @track selectedAccount = [];
  @track mapData = [];
  @track searchedAccount;
  @track oldMapData = [];
  _SelectedAccountValues = [];
  @track mapRolesData = [];
  @track selectedRoles = [];
  isLoaded = false;
  // @wire(getAllAccount, { selectedContactId: "$recordId" })
  // accounts({ data, error }) {
  //   if (data) {
  //     let mapVal = [];
  //     data.forEach((element) => {
  //       mapVal.push({ label: element.Name, value: element.Id });
  //     });
  //     this.mapData = mapVal;
  //     this.oldMapData = [...mapVal];
  //     console.log("this.mapData==>", this.mapData);
  //   }
  //   if (error) {
  //     console.log(` Error while fetching Picklist values  ${error}`);
  //     this.error = error;
  //   }
  // }

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

  handleAccountChange(event) {
    this.selectedAccount = event.detail.value;
    let seletcedData = this.oldMapData.filter(
      (obj) => this.selected.indexOf(obj.value) !== -1
    );
    console.log("this.selected==>", seletcedData);
    this._SelectedAccountValues = [...seletcedData];
    console.log("this.selected==>", event.detail.value);
  }

  handleRoleChange(event) {
    this.selectedRoles = event.detail.value;
    console.log("this.selected==>", this.selectedRoles);
  }

  handleSearchKeyUp(event) {
    console.log("this.searchedAccount==>" + event.target.value);
    if (event.target.value.length > 0) {
      let arr = this.oldMapData.filter(
        (obj) =>
          obj.label.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
      );
      console.log("** ", arr);
      this.mapData = [...arr, ...this._SelectedAccountValues];
    } else {
      this.mapData = [...this.oldMapData];
      console.log("this.searchedAccountthis.mapData==>" + this.mapData);
    }
  }

  // saveContactAccountRelation(event) {
  //   const selectedAcc = event.detail;
  //   console.log("selectedAcc==>", selectedAcc);
  // }
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
