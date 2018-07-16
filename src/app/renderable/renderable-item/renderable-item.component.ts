import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';



@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {
  
  public form   : HTMLElement;
  public modal  : HTMLElement;
  public editor : Editor;
  public illegalInputEvent  : RegExp;
  public illegalInputScript : RegExp;
  public modalActive  : Boolean;
  public finalHTML    : String;
  public musStyle : Object;
  public sysStyle : Object;
  public currentStyle : Object;
  
  
  constructor() {}
  
  ngOnInit() {
    this.modalActive = false;
    this.editor = new Editor;
    this.form = document.getElementById('lead-gen-form-input');
    // start with MUS style
    this.musStyle = this.editor.MUS;
    this.sysStyle = this.editor.SYS;
    this.currentStyle = this.musStyle;
    this.stylizer(this.currentStyle["title"]);
    
    
    // If allowing HTML. Will also need diverse event regex's
    // this.illegalInputEvent = /"\bon[A-Z]+"/;
    // this.illegalInputScript = /"\b<script>"/;
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
      newInput = this.makeField(identifiedBy, elem, <string> this.currentStyle);
    else // otherOpt is a universal flag. See the docstring in makeField()
      newInput = this.makeField(identifiedBy, elem, <string> this.currentStyle, otherOpt);

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
  makeField = (idBy : string, elem : string, currentStyle : Object, otherOpt? : number) : Element => {
    /** 
     * Other Options : These values are determined by the function call in renderable-item-component.html
     * 
     *    0 == (null)
     *    1 == make a last name input instead of a first name input
     */

    // <HTMLElement> factory for the form to be generated

    let newInput : Element;
    var auxNodes : Object; // i.e. <option> units
    let encaps   : Element = document.createElement("DIV");
    let label    : Element = document.createElement("LABEL");

    // Determine <input> || <textarea> || <select> to render
    if (elem == "select")
      var input : Element = document.createElement("SELECT");
    else if (elem == "textarea"){
      var input : Element = document.createElement("TEXTAREA");
      input.setAttribute("rows", "3");
    }
    else
      var input : Element = document.createElement("INPUT");

    
    label.classList.add("ng-anchor");

    // Bootstrap Classes
    input.classList.add("form-control");
    label.classList.add("control-label");
    encaps.classList.add("form-group"); 

    // Construction
    switch (idBy) {

      case "nameField":
        if(otherOpt == 1)
          label.textContent = "Last Name";
        else
          label.textContent = "First Name";

        input.setAttribute('type', elem);
        input.setAttribute('style', currentStyle["MajorInput"]);
        input.setAttribute('class', 'input-xxlarge');
        input.setAttribute('id', 'first-name');
        input.setAttribute('name', 'first_name');
        input.setAttribute('required', 'required');
        encaps.appendChild(label);
        encaps.appendChild(input);

        return encaps;

      case "checkboxField":
        input.setAttribute('type', elem);
        input.setAttribute('style', currentStyle["checkboxes"]);
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
          // Recycling the clone
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
        input.setAttribute('style', currentStyle['TextAreaHelp']);
        input.setAttribute('cols', '45');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'comments');
        encaps.appendChild(input);
        container.appendChild(label);
        container.appendChild(encaps);
        return container;
        
      default:
        console.log("Improbability Alert : silently failing!");
        console.log(`\n\nError : \n -- ${input} \n -- ${label} \n -- ${encaps} \n\n\n`);
        return null;
      }
    }

  openEditor = (idBy : string) : void => {
    
    // Acquire Editor space and get the corresponding editor from editor.editorNodes
    var editorWindow = document.getElementById("in-editor");
    let newEditorEls = this.editor.editorNodes(idBy);

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

  stylizer(style : string) : void {
    // Toggles between styles for MUS vs SYS

    if (style == "MUS") 
      this.currentStyle = this.musStyle;
    else if (style == "SYS")
      this.currentStyle = this.sysStyle;

    let container = document.getElementById("consult-form-container");
    let deactivated = document.querySelector(".active");
    let button = document.getElementById(<string> style); // change color & highlight

    container.setAttribute("style", this.currentStyle['container']);
    deactivated.classList.remove("active");
    button.classList.add("active");


    
  }

  displayHTML() : void {
    let theHTML = document.getElementById("pretty-print");
    this.modalActive = true; 
    this.finalHTML = <string> document.getElementById("view-form").innerHTML;
    this.modal = document.getElementById("modal-html-view");
    this.modal.style.display = "block";
    document.body.classList.add("raise-modal");
    theHTML.textContent = <string> this.finalHTML;
    return;
  }

  closeModal() : void {

    document.body.classList.remove("raise-modal");
    this.modal.style.display = "none";
    this.modalActive = false;
    return;
  }

  addCaptcha() : void {
    /*
       Recaptcha factory function
       Gets called post form completion
    */

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