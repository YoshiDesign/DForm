import { EventEmitter } from "../../../node_modules/@angular/core";

export class ResourceManager {
    
  public arb : Object;
  public resourceMonitorOpen : Boolean;
  public listrakActive : Boolean;
  public listrakExternalId;
  public listrakSource;
  public CRMDescription;
  public CRMLeadSource;
  public theForm;
  public checkListrak; // Implicitly cast or otherwise broken

  constructor(){
      this.listrakActive = false;
      this.resourceMonitorOpen  = false;
      this.arb = {};
  }

  openResource(e : Event, type : string, IdBy : string) : void {

      this.resourceMonitorOpen = true;
  
  }

  activateListrak (e) : void {
      /**
       * Enable/Disable defaultly disabled nodes under Listrak Resource
       */
      let lisTracking = document.getElementById("listracking");
      let listrakSource = document.getElementById("listrak-source-resource");
      let listrakExternalId = document.getElementById("listrak-externalid-resource");
  
      for (let i = 0; i < lisTracking.children.length; i++)
      {
        if (e.target.checked) {
          lisTracking.children[i].removeAttribute("disabled");
          listrakSource.setAttribute("value", "2403731");
          listrakExternalId.setAttribute("value", "13064");
        }
        else {
          if (lisTracking.children[i].hasAttribute("type")) {
            lisTracking.children[i].setAttribute("disabled", "");
            lisTracking.children[i].setAttribute("value", "");
          }
        }
      }
    }

    applySettings () : void {

      /**
       * When user clicks "Done"
       */

      let listrakExternalIdValue;
      let listrakSourceValue;
      let CRMDescriptionValue;
      let CRMLeadSourceValue;

      this.theForm = document.getElementById('lead-gen-form-input');
      this.CRMDescription = document.getElementById('both-resource-description');
      this.CRMLeadSource = document.getElementById('both-resource-lead-source');
      this.checkListrak = document.getElementById('append-listrak');

      // Remove any existing resources
      var removed = document.querySelectorAll('[data-hide-ng]') || null;
      if (removed.length > 0) {
        for (var i = 0; i < removed.length; i++) {
          removed[i].parentNode.removeChild(removed[i]);
        }
      }

      let newHiddenField = document.createElement('INPUT');
      newHiddenField.setAttribute('data-hide-ng', '');
      newHiddenField.setAttribute('type', 'hidden');

      let descriptionField =  <HTMLElement> newHiddenField.cloneNode();
      let leadSrcField     =  <HTMLElement> newHiddenField.cloneNode();
      let referralUrlField =  <HTMLElement> newHiddenField.cloneNode();

      descriptionField.setAttribute('name','description');
      descriptionField.setAttribute('value', this.CRMDescription.value);

      leadSrcField.setAttribute('name', 'lead_source');
      leadSrcField.setAttribute('value', this.CRMLeadSource.value);

      referralUrlField.setAttribute('id', 'referral_url');
      referralUrlField.setAttribute('name', 'referral_url');
      referralUrlField.setAttribute('value', "");

      if (this.checkListrak.checked) {
        this.listrakExternalId = document.getElementById('listrak-externalid-resource');
        this.listrakSource = document.getElementById('listrak-source-resource');

        var lisExtId  = <HTMLElement> newHiddenField.cloneNode();
        var lisSrc    = <HTMLElement> newHiddenField.cloneNode();

        lisExtId.setAttribute('name', 'listrak_external_id');
        lisSrc.setAttribute('name', 'listrak_source');

        lisExtId.setAttribute('value', this.listrakExternalId.value);
        lisSrc.setAttribute('value', this.listrakSource.value);

        this.theForm.appendChild(lisExtId);
        this.theForm.appendChild(lisSrc);
      }

      this.theForm.appendChild(descriptionField);
      this.theForm.appendChild(leadSrcField);
      this.theForm.appendChild(referralUrlField);
      
      this.resourceMonitorOpen = false;

      this.listHiddenFields();

    }

    listHiddenFields() : Boolean {

      let fields = document.querySelectorAll('input[data-hide-ng]') || null;
  
      if (fields == null)
        return false;
  
      else {
  
        var names = [];
        var values = [];
        this.arb['count'] = 0;
  
        for (let i = 0; i < fields.length; i++)
        {

          names.push(fields[i].getAttribute('name'));

          if (fields[i].getAttribute('name') == "referral_url")
            values.push("(automatic)");
          else
            values.push(fields[i].getAttribute('value'));

          this.arb['count']++;
          
        }
        
        this.arb['names'] = names;
        this.arb['values'] = values;

      }
      
      return true;

    }    
}