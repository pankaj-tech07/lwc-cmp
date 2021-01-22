import { LightningElement, track, api } from "lwc";
import getAllAccount from "@salesforce/apex/AccountContactRelationController.getAccount";
import saveContactAccount from "@salesforce/apex/AccountContactRelationController.saveContactAccount";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class AccountMultiSelectLookup extends LightningElement {
  @api contactId;
  objectName = "Account";
  //@track searchRecords = [];
  @track searchAccRecords = [];
  @track selectedAccRecords = [];
  @api iconName = "action:new_account";
  @api LoadingText = false;
  @track txtclassname =
    "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
  @track messageFlag = false;
  @track selectedAccRoles;
  isLoaded = false;

  searchAccountRec(event) {
    var currentText = event.target.value;
    console.log("-------currentText-------------", currentText);
    var selectRecId = [];
    for (let i = 0; i < this.selectedAccRecords.length; i++) {
      selectRecId.push(this.selectedAccRecords[i].recId);
    }
    this.LoadingText = true;
    getAllAccount({
      contactRecId: this.contactId,
      searchedValue: currentText,
      selectedRecId: selectRecId
    })
      .then((result) => {
        this.searchAccRecords = result;
        console.log(
          "-------this.searchAccRecords -------------" + this.searchAccRecords
        );
        this.LoadingText = false;

        this.txtclassname =
          result.length > 0
            ? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
            : "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
        if (currentText.length > 0 && result.length == 0) {
          this.messageFlag = true;
        } else {
          this.messageFlag = false;
        }

        if (this.selectRecordId != null && this.selectRecordId.length > 0) {
          this.iconFlag = false;
          this.clearIconFlag = true;
        } else {
          this.iconFlag = true;
          this.clearIconFlag = false;
        }
      })
      .catch((error) => {
        console.log("-------error-------------" + error);
        console.log(error);
      });
  }

  setSelectedRecord(event) {
    var recId = event.currentTarget.dataset.id;
    var selectName = event.currentTarget.dataset.name;
    let newsObject = { recId: recId, recName: selectName };
    this.selectedAccRecords.push(newsObject);
    this.txtclassname =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
    this.template.querySelectorAll("lightning-input").forEach((each) => {
      each.value = "";
    });
  }

  removeRecord(event) {
    let selectRecId = [];
    for (let i = 0; i < this.selectedAccRecords.length; i++) {
      if (event.detail.name !== this.selectedAccRecords[i].recId)
        selectRecId.push(this.selectedAccRecords[i]);
    }
    this.selectedAccRecords = [...selectRecId];
  }

  // This is use to save the record
  @api
  addSelectedRoles(selectedRoles) {
    try {
      this.selectedAccRoles = selectedRoles;

      let accountContactRelations = [];
      if (!this.selectedAccRecords.length) {
        this.isLoaded = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Please select atleast 1 Account",
            variant: "error"
          })
        );
        this.dispatchEvent(
          new CustomEvent("showerrormsg", {
            detail: this.isLoaded
          })
        );
        //return false;
      } else {
        this.selectedAccRecords.forEach((element) => {
          let obj = {};
          obj.AccountId = element.recId;
          obj.ContactId = this.contactId;
          if (this.selectedAccRoles.length) {
            obj.Roles = this.selectedAccRoles.join(";");
          }
          accountContactRelations.push(obj);
        });
        saveContactAccount({
          accountContactRelations
        })
          .then((result) => {
            this.isLoaded = false;
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success!!",
                message: "Account Created Successfully!!",
                variant: "success"
              })
            );
            this.dispatchEvent(
              new CustomEvent("closemodal", {
                detail: {},
                bubbles: true,
                composed: true
              })
            );
          })
          .catch((error) => {
            console.log("OUTPUT : ", error);
            this.error = error.message;
            this.isLoaded = false;
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error",
                message: error.message,
                variant: "error"
              })
            );
          });
      }
    } catch (error) {
      console.error("error : ", error);
    }
  }
}
