import { EventEmitter } from "../../../node_modules/@angular/core";

export class ResourceManager {
    
  public arb : Object;
  public resourceMonitorOpen : Boolean;
  public MailchimpActive : Boolean;
  public MailchimpExternalId;
  public MailchimpSource;
  public CRMDescription;
  public theForm;
  public checkMailchimp; // Implicitly cast or otherwise broken

  constructor(){
      this.MailchimpActive = false;
      this.resourceMonitorOpen  = false;
      this.arb = {};
  }

  openResource(e : Event, type : string, IdBy : string) : void {

      this.resourceMonitorOpen = true;
  
  }

  activateMailchimp (e) : void {
      /**
       * Enable/Disable defaultly disabled nodes under Mailchimp Resource
       */
      let mailchimper = document.getElementById("mailchimper");
      let MailchimpSource = document.getElementById("Mailchimp-source-resource");
      let MailchimpExternalId = document.getElementById("Mailchimp-externalid-resource");
  
      for (let i = 0; i < mailchimper.children.length; i++)
      {
        if (e.target.checked) {
          mailchimper.children[i].removeAttribute("disabled");
          MailchimpSource.setAttribute("value", "2403731");
          MailchimpExternalId.setAttribute("value", "13064");
        }
        else {
          if (mailchimper.children[i].hasAttribute("type")) {
            mailchimper.children[i].setAttribute("disabled", "");
            mailchimper.children[i].setAttribute("value", "");
          }
        }
      }
    }

    applySettings () : void {

      /**
       * When user clicks "Done"
       */

      let MailchimpExternalIdValue;
      let MailchimpSourceValue;
      let CRMDescriptionValue;

      this.theForm = document.getElementById('lead-gen-form-input');
      this.CRMDescription = document.getElementById('both-resource-description')
      this.checkMailchimp = document.getElementById('append-Mailchimp');

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
      let referralUrlField =  <HTMLElement> newHiddenField.cloneNode();

      descriptionField.setAttribute('name','description');
      descriptionField.setAttribute('value', this.CRMDescription.value);

      referralUrlField.setAttribute('id', 'referral_url');
      referralUrlField.setAttribute('name', 'referral_url');
      referralUrlField.setAttribute('value', "");

      if (this.checkMailchimp.checked) {
        this.MailchimpExternalId = document.getElementById('Mailchimp-externalid-resource');
        this.MailchimpSource = document.getElementById('Mailchimp-source-resource');

        var lisExtId  = <HTMLElement> newHiddenField.cloneNode();
        var lisSrc    = <HTMLElement> newHiddenField.cloneNode();

        lisExtId.setAttribute('name', 'Mailchimp_external_id');
        lisSrc.setAttribute('name', 'Mailchimp_source');

        lisExtId.setAttribute('value', this.MailchimpExternalId.value);
        lisSrc.setAttribute('value', this.MailchimpSource.value);

        this.theForm.appendChild(lisExtId);
        this.theForm.appendChild(lisSrc);
      }

      this.theForm.appendChild(descriptionField);
      this.theForm.appendChild(referralUrlField);
      
      this.resourceMonitorOpen = false;

      this.listHiddenFields();

    }

    listHiddenFields() : Boolean {

      let fields = document.querySelectorAll('input[data-hide-ng]') || null;
      console.log("fields");
      console.log(fields);
  
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