import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';

@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {
  
  public form   : Element;
  public editor : Editor;
  public illegalInputEvent  : RegExp;
  public illegalInputScript : RegExp;
  
  constructor() {}

  ngOnInit() {
    this.editor = new Editor;
    this.illegalInputEvent = /"^on+$"/;
    this.illegalInputScript = /"[<script>]"/;
    this.form = document.getElementById('lead-gen-form-input');
  }

  toggleAdd(event, elem : string, identifiedBy : string, otherOpt? : number){
    /** 
    *   Adds visible element to middle column.
    *   otherOpt is a universal flag for transitive state.
    *   +localize 'attr' with scope visibility.
    */
    let newInput : Element; // Encapsulated per the page spec.
    if (elem == null || undefined) {
      // Do nothing
      return;
    }

    // Create Editor View
    this.openEditor(identifiedBy);

    // Returns a formatted input view
    if (!otherOpt)
      newInput = this.makeField(identifiedBy, elem);
    else // otherOpt is a universal flag. 
      newInput = this.makeField(identifiedBy, elem, 1);

    // Send new input to the next available field
    this.form.appendChild(newInput);

    event.stopPropagation();
  }
  
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////
  makeField = (idBy : string, elem : string, otherOpt? : number) : Element => {

    let newInput : Element;
    let auxNodes : Element; // i.e. <option> units
    let encap    : Element = document.createElement("P");
    let label    : Element = document.createElement("LABEL");

    label.classList.add("ng-anchor");

    if (elem == "select")
      var input : Element = document.createElement("SELECT");
    else if (elem == "textarea")
      var input : Element = document.createElement("TEXTAREA");
    else
      var input : Element = document.createElement("INPUT");

    console.log(`MAKEFIELD WITH ELEM = ${elem}`);
    console.log(`MAKEFIELD WITH idBy = ${idBy}`);
    
    switch (idBy) {

      case "nameField":
        if(otherOpt)
          label.textContent = "Last Name";
        else
          label.textContent = "First Name";
        console.log("ENCAP" + encap);
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "emailField":
        label.textContent = "Email";
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "telField":
        label.textContent = "Phone Number (format: XXX-XXX-XXXX)";
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "passwdField":
        label.textContent = "Password";
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "checkboxField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "colorField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "rangeField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "dateField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "timeField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "fileField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "radioField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;
        
      case "selectField":
        let getLocale = new Editor;
        let places = getLocale.selectOptions;
        for (let i in places){
          // Recycling variable to append locale to select box. places[loc] = Literal location name
          var newOption = document.createElement("OPTION");
          newOption.setAttribute("value", <string> i);
          newOption.innerText = <string> places[i];
          input.appendChild(newOption);
        }
        label.textContent = "State";
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        console.log(`LOCALE ITEMS : ${places}`);
        
        return encap;

      case "textareaField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      default:
        console.log("Improbability Alert : failing quietly");
        return null;
    }
  }

  openEditor = (idBy : string) : void => {
    
    var editorWindow = document.getElementById("in-editor");
    // We could also build html elements as pure strings (bad practice but an alternative if ever needed)
    // let newEditorEls = JSON.parse(<string>this.editor.editorNodes(idBy)) || null;

    let newEditorEls = this.editor.editorNodes(idBy);

    // null == undefined
    if (newEditorEls == null) {
      editorWindow.innerHTML = "<span>No editing options</span>";
      return;
    }
    
    // Apply Template to right
    editorWindow.appendChild(newEditorEls);

    if (editorWindow.innerHTML)
    {
      /**
       * nglabeling is the EDITOR'S CURRENT INPUT FIELD.
       * Change to class list for future extensibility.
       *           This is a refactor point.
       */
      let inField = document.getElementById("nglabeling"); 
      inField.addEventListener('input', (e)=>{this.changeLabel(e, idBy)} );
    } 
    else return;

    console.log(newEditorEls);

  }

  changeLabel(e , idBy : string) : void {

    /**
     *  Part of the Editor's functionality and (currently) allows us 
     *  to edit the label of the most recently added element.
     *  The event variable is of the next lower ordered functions stack frame
     */

    let FormLabels : NodeList;
    // Most recently added elem's <label>
    let lastFormLabel : Node;

    // ng-anchor(s) exist on each of the rendering form's labels
    FormLabels = document.querySelectorAll(".ng-anchor");
    console.log(`FormLabels length : ${FormLabels.length}`);
    lastFormLabel = FormLabels[FormLabels.length - 1];
    console.log(`LAST FORM LABEL ${lastFormLabel}`);

    lastFormLabel.textContent = e.target.value;
    
    console.log("changeDetected");
  }

  addCapcha() : void {
    /*
       Recaptcha factory function
       Gets called post form completion
    */
    console.log("click");
    let reCapchaElement = document.createElement("DIV");
    
    reCapchaElement.setAttribute('class', 'g-recaptcha');
    reCapchaElement.setAttribute('data-sitekey', '6Lc3HWQUAAAAAAmrhK6RI77MSoHAmRH__OxEDDeB');

  // append our completed captcha to the form
    this.form.appendChild(reCapchaElement);

  }
  finalize() : Number {
    this.addCapcha()
    return 0;
  }
  setStyle(attribute) {

    var style = attribute;

  }
  setAttrs(element) {
    return 0;
  }
  toScreen() {
    return 0;
  }


}