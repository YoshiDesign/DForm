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
     * Other Option Values : These values are determined by the function call in renderable-item-component.html
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
    if (idBy != "checkboxField") // Becuse checkboxes require bootstrap override
      input.classList.add("form-control");

    label.classList.add("control-label");
    encaps.classList.add("form-group"); 
    
    /**
     *  This switch appends Elements and applies Attributes / Styles.
     *  It is 100% DOM management.
     *  otherOpt flags are enumerated in the DocString.
     */
    switch (idBy) {
      
      case "nameField":
        if(otherOpt == 1){
          label.textContent = "Last Name";
          input.setAttribute('id', 'last-name')
          input.setAttribute('name', 'last_name');
        }
        else if (otherOpt == null){
          label.textContent = "First Name";
          input.setAttribute('id', 'first-name');
          input.setAttribute('name', 'first_name');

        }

        input.setAttribute('class', 'input-xxlarge form-control');
        input.setAttribute('style', currentStyle["MajorInput"]);
        input.setAttribute('required', 'required');
        input.setAttribute('id', 'first-name');
        input.setAttribute('type', elem);

        encaps.appendChild(label);
        encaps.appendChild(input);
        
        return encaps;

      case "subButtonField":
        input.setAttribute('id', 'leadGen');
        input.setAttribute('type', 'submit');
        input.setAttribute('disabled', '');
        input.setAttribute('style', currentStyle['SubmitButtonStyles']);

        if (this.currentStyle["title"] == "MUS"){
          input.setAttribute('value', 'lets go!');
          input.setAttribute('class', 'btn btn-large btn-success');
        }
        else if (this.currentStyle['title'] == "SYS"){
          input.setAttribute('value', 'watch the webinar!');
          input.setAttribute('class', 'btn btn-primary form-control');
        }

        encaps.appendChild(input);

        return encaps;

      case "checkboxField":
        if(this.currentStyle['title'] == "MUS")
          input.setAttribute('value', 'Homeschool');
        else if (this.currentStyle['title'] == "SYS")
          input.setAttribute('value', 'Homeschool');

        input.setAttribute('type', elem);
        input.setAttribute('name', 'assign_to')
        input.setAttribute('style', currentStyle["CheckBoxes"]);
        
        encaps.appendChild(input);
        encaps.appendChild(label);
        return encaps;
      
      case "emailField":
        label.textContent = "Email";
        input.setAttribute('type', elem);
        input.setAttribute('style', currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "telField":
        label.textContent = "Phone Number (format: XXX-XXX-XXXX)";
        input.setAttribute('type', elem);
        input.setAttribute('style', currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
        
      case "dateField":
        input.setAttribute('style', currentStyle["MajorInput"]);
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "passwdField":
        input.setAttribute('style', currentStyle["MajorInput"]);
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
        label.textContent = "Qty."
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "colorField":
        label.textContent = "Pick Color";
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
        // An object containing States & Abbreviatiosns.
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
        input.setAttribute('style', currentStyle['SelectBox']);
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

    // Exit when we try to acquire a field without a label (i.e. submit)
    if(!lastFormLabel)
      return;

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

    let container   = document.getElementById("consult-form-container");
    let deactivated = document.querySelector(".active");
    let button      = document.getElementById(<string> style); // change color & highlight

    if (style == "MUS")         // If clicked MUS
      this.currentStyle = this.musStyle;
    
    else if (style == "SYS")    // If clicked SYS
      this.currentStyle = this.sysStyle;

    container.setAttribute("style", this.currentStyle['container']);
    deactivated.classList.remove("active");
    button.classList.add("active");

  }

  displayHTML() : void {
    /**
     * Modal
     */
    this.modalActive  = true; 
    let theHTML       = document.getElementById("pretty-print");
    this.finalHTML    = <string> document.getElementById("view-form").innerHTML;
    this.modal        = document.getElementById("modal-html-view");

    // Display Modal and Dim the lights
    this.modal.style.display = "block";
    // Security ++
    this.addCaptcha();

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
    /**
     *  Recaptcha is applied when the user
     *  clicks the <HTML> button
     */

    let reCapchaElement = document.createElement("DIV");
    
    // Deploy attributes to recaptch DIV
    reCapchaElement.setAttribute('class', 'g-recaptcha');
    reCapchaElement.setAttribute('data-sitekey', '6Lc3HWQUAAAAAAmrhK6RI77MSoHAmRH__OxEDDeB');   // The sitekey goes here
    reCapchaElement.setAttribute('data-callback', 'enableBtn');

    // append our completed captcha to the form
    this.form.appendChild(reCapchaElement);

  }
  getOutputDepth() : number {
    let outWindow = document.getElementById('pretty-print');
    let height    = outWindow.clientHeight;
    console.log(`CLIENT HEIGHT ${height}`);
    return height;
  }
}