import { LightningElement, track, wire } from "lwc";
import getAllAccount from "@salesforce/apex/SearchableDualListboxController.getAllAccount";
export default class SearchableDualListbox extends LightningElement {
  @track selected = [];
  @track mapData = [];
  @track searchedAccount;
  @track oldMapData = [];
  _SelectedValues = [];

  @wire(getAllAccount)
  accounts({ data, error }) {
    if (data) {
      let mapVal = [];
      data.forEach((element) => {
        mapVal.push({ label: element.Name, value: element.Id });
      });
      this.mapData = mapVal;
      this.oldMapData = [...mapVal];
      console.log("this.mapData==>", this.mapData);
    }
    if (error) {
      console.log(` Error while fetching Picklist values  ${error}`);
      this.error = error;
    }
  }

  handleChange(event) {
    this.selected = event.detail.value;
    let seletcedData = this.oldMapData.filter(
      (obj) => this.selected.indexOf(obj.value) !== -1
    );
    console.log("this.selected==>", seletcedData);
    this._SelectedValues = [...seletcedData];
    console.log("this.selected==>", event.detail.value);
  }

  handleSearchKeyUp(event) {
    console.log("this.searchedAccount==>" + event.target.value);
    if (event.target.value.length > 0) {
      let arr = this.oldMapData.filter(
        (obj) =>
          obj.label.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
      );
      console.log("** ", arr);
      this.mapData = [...arr, ...this._SelectedValues];
    } else {
      this.mapData = [...this.oldMapData];
      console.log("this.searchedAccountthis.mapData==>" + this.mapData);
    }
  }
}
