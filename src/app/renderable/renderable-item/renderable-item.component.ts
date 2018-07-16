import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';

@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {
  
  public form   : Element;
  public modal  : HTMLElement;
  public editor : Editor;
  public illegalInputEvent  : RegExp;
  public illegalInputScript : RegExp;
  public modalActive : Boolean;
  public finalHTML : String;
  
  constructor() {}
  
  ngOnInit() {
    this.modalActive = false;
    this.editor = new Editor;
    // Use when allowing HTML
    // this.illegalInputEvent = /"\bon[A-Z]+"/;
    // this.illegalInputScript = /"\b<script>"/;
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
  removeRecent(){
  
    let mostRecentField = document.getElementById('lead-gen-form-input')
    console.log(mostRecentField);
    let length = mostRecentField.childNodes.length;
    mostRecentField.removeChild(mostRecentField.childNodes[length - 1]);
    
  }
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////
  makeField = (idBy : string, elem : string, otherOpt? : number) : Element => {

    // <HTMLElement> factory

    let newInput : Element;
    var auxNodes : Object; // i.e. <option> units
    let encaps   : Element = document.createElement("P");
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
        console.log("ENCAP" + encaps);
        input.setAttribute('type', elem);
        input.setAttribute('style', this.editor.styles["major"]);
        input.setAttribute('class', 'input-xxlarge');
        input.setAttribute('id', 'first-name');
        input.setAttribute('name', 'first_name');
        input.setAttribute('required', 'required');
        encaps.appendChild(label);
        encaps.appendChild(input);

        return encaps;

      case "checkboxField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "emailField":
        label.textContent = "Email";
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "dateField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "passwdField":
        label.textContent = "Password";
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "fileField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
      
      case "numberField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "colorField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
        
      case "rangeField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "selectField":
        // Populate our select box
        auxNodes = this.editor.selectOptions;
        var option = document.createElement("OPTION");

        for (let i in auxNodes){
          // Recycling a clone
          let newOption = <HTMLElement> option.cloneNode();
          newOption.setAttribute("value", <string> i);
          newOption.innerText = <string> auxNodes[i];
          input.appendChild(newOption);
        }

        label.textContent = "State";
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        
        return encaps;
        
      case "timeField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

        case "radioField":
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
   
      case "telField":
        label.textContent = "Phone Number (format: XXX-XXX-XXXX)";
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
          
      case "textareaField":
        let container = document.createElement('DIV');
        // fix this please
        container.setAttribute('style', 'width:90%;')
        label.textContent = "How can we help?";
        input.setAttribute('style', this.editor.styles['musTextAreaHelp']);
        input.setAttribute('cols', '45');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'comments');
        encaps.appendChild(input);
        container.appendChild(label);
        container.appendChild(encaps);
        return container;
        
        default:
        console.log("Improbability Alert : failing quietly");
        return null;
      }
    }

  openEditor = (idBy : string) : void => {
    
    var editorWindow = document.getElementById("in-editor");

    let newEditorEls = this.editor.editorNodes(idBy);
    console.log("NEW EDITOR ELS" + newEditorEls);

    // null == undefined
    if (newEditorEls == null) {
      editorWindow.innerHTML = "<span>No editing options</span>";
      return;
    }

    // Build current field's associated editor display
    if (editorWindow.innerHTML){
      var oldNode = document.getElementById("nglabeling");
      oldNode.remove();
    }

    editorWindow.appendChild(newEditorEls);

    if (editorWindow.innerHTML)
    {
      /**
       * nglabeling is the EDITOR'S CURRENT INPUT FIELD.
       * Change to class list for future extensibility.
       *          This is a refactor point.
       */
      let inField = document.getElementById("nglabeling"); 
      inField.addEventListener('input', (e)=>{this.changeLabel(e, idBy)} );
    } 
    else return;

    console.log(newEditorEls + " : success");

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

  makeWidget(event : Event, widget : string) : void {
    /**
     *  Define the CONSTRUCTION of widgets here.
     *  See ./html/htmleditor.ts->[Obj widgets] for the DEFINITION of styles, attr's, etc...
     *  Widgets are visible in expanded state until the HTML is exported.
     *  Define future widgets here.
     */
    let encaps;
    let para;
    let label;
    let input;
    switch(widget){

      case "school" : 
        encaps = document.createElement("DIV");
        label  = document.createElement("LABEL");
        para   = document.createElement("P");
        input  = document.createElement("INPUT");

        para.appendChild(label); para.appendChild(input);
        encaps.appendChild(para); encaps.appendChild(para); encaps.appendChild(para);

      default :
        return;
    }
  }

  exportWidget(widget : string){
    switch (widget) {
      case "schoolWidget":
        
        break;
    
      default:
        break;
    }
  }

  displayHTML() : void {

    this.finalHTML = document.getElementById("view-form").innerHTML;
    this.modal = document.getElementById("modal-html-view");
    document.body.classList.add("raise-modal");
    this.modal.style.display = "block";

  }
  closeModal() : void {
    document.body.classList.remove("raise-modal");
    this.modal.style.display = "none";
    return;
  }

  addCaptcha() : void {
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
    /** 
     * TODO
     *  export widget
     */
    // Garbage collection // apply ReCaptcha // apply widget params.
    let widget = null;
    delete(this.editor);
    this.addCaptcha();
    this.exportWidget(widget);
    return 0;
  }

}