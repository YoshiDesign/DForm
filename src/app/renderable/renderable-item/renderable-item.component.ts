import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';



@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {

  public editor : Editor;          // Custom class. Defines our styles, Option editor inputs and other static items.
  public modal  : HTMLElement;
  public illegalInputEvent  : RegExp;
  public illegalInputScript : RegExp;
  public modalActive  : Boolean;
  public finalHTML    : String;
  public musStyle : Object;
  public sysStyle : Object;
  public currentStyle : Object;    // Either "MUS" or "SYS". "MUS" as Default
  public history : Array <string>; // History does NOT sync via querying the page. It requires sync during toggleAdd & toggleRemove
  
  constructor() {
    this.history = [];
  }
  
  ngOnInit() {

    this.modalActive = false;
    this.editor = new Editor;
    this.openEditor("noField");
    // start with MUS style
    this.musStyle     = this.editor.MUS;
    this.sysStyle     = this.editor.SYS;
    this.currentStyle = this.musStyle;

    this.stylizer(this.currentStyle["title"], true);
    
    // currently all dynamic HTML is disabled by default so these are useless.
    // this.illegalInputEvent = /"\bon[A-Z]+"/;
    // this.illegalInputScript = /"\b<script>"/;
  }
  
  toggleAdd(event, elem : string, identifiedBy : string, otherOpt? : number){
    /** 
    *   Adds visible element to middle column.
    *   otherOpt is a universal flag for optional behavior. See makeField() docstring
    */
    let form = document.getElementById('lead-gen-form-input');
    let newInput : Element; // Encapsulated per the page spec.

    if (elem == null || undefined) {
      // Do nothing
      return;
    }

    // Sync the order of elements being inserted
    this.history.push(<string> identifiedBy);
    console.log(this.history);

    // Update Option Editor view
    this.openEditor(identifiedBy);

    // Standard enter here
    if (!otherOpt)
      newInput = this.makeField(<string> elem,
                                <string> identifiedBy);
    else // otherOpt is a universal flag. See makeField() docstr
      newInput = this.makeField(<string> elem,
                                <string> identifiedBy,
                                <number> otherOpt);

    // we addCaptcha() explicitly
    if (elem == "recaptcha")
      return;

    // Send new input to the next available field
    form.appendChild(newInput);

    event.stopPropagation();
  }

  toggleRemove(clearAll? : Boolean) : void {
    let findMostRecentField = document.getElementById('lead-gen-form-input');
    if(clearAll)
    {
      this.history = [];
      this.openEditor("noField");
      console.log("HISTORY IS EMPTY? " + this.history);
      var allNewFields = document.querySelectorAll('div[data-dynaform]');
      for (let i  in allNewFields){
        if (i == "length") // moot : last element of a <NodeList> is its own length. This silences a pointless error.
          break
        allNewFields[i].parentNode.removeChild(allNewFields[i]);
      }
      return;
    }

    this.history.pop();
    this.openEditor(this.history[this.history.length - 1]);
    console.log("UPDATING HISTORY " + this.history);
    let length = findMostRecentField.childNodes.length;
    let dontRemove = <HTMLElement>findMostRecentField.childNodes[length-1];

    if (!(dontRemove.hasAttribute('data-dynaform')))
      return;
    else  
      findMostRecentField.removeChild(findMostRecentField.childNodes[length - 1]);
    
  }
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////
  makeField = (elem : string, idBy : string, otherOpt? : number) : Element => {
    /** 
     * Other Option Values : These values are determined by the function call in renderable-item-component.html
     * 
     *    0 == (null)
     *    1 == make a last name input instead of a first name input
     */

    // <HTMLElement> factory for the form to be generated

    var auxNodes : Object; // i.e. <option> units for select boxes
    let encaps   : Element = document.createElement("DIV");
    let label    : Element = document.createElement("LABEL");

    // determine most significant inner node
    if (elem == "select")
      var input : Element = document.createElement("SELECT");
    else if (elem == "textarea") {
      var input : Element = document.createElement("TEXTAREA");
      input.setAttribute("rows", "3");
    } else
      var input : Element = document.createElement("INPUT");
    
    // Tracking & class
    label.classList.add("ng-anchor-label");
    label.classList.add("control-label");

    // Tracking & class
    encaps.setAttribute('data-dynaform', '');
    encaps.classList.add("form-group");

    // Apply Bootstrap Classes to proper nodes. Selectables require override
    if (idBy != "checkboxField" && idBy != "radioField")
      input.classList.add("form-control");

    /**
     *  This switch appends Elements and applies Attributes / Styles.
     *  It is 100% DOM management.
     *  [otherOpt] current flags are enumerated in the DocString at the top of the function.
     */

    // If we need a widget, get the widget and exit.
    if (elem == "widget")
        return this.makeWidget(idBy);
    
    switch (idBy) {
      // safety first.
      case "recaptchaField":
        // punt to recap
        this.addCaptcha();
        return null;

      case "nameField":

        if(otherOpt == 1) {
          console.log("other opt")
          label.textContent = "Last Name";
          input.setAttribute('id', 'last-name')
          input.setAttribute('name', 'last_name');
        }
        else if (otherOpt == null) {
          label.textContent = "First Name";
          input.setAttribute('id', 'first-name');
          input.setAttribute('name', 'first_name');
        }

        input.setAttribute('class', 'input-xxlarge form-control');
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);

        encaps.appendChild(label);
        encaps.appendChild(input);
        
        return encaps;

      case "subButtonField":
        
        encaps.setAttribute('data-dyna-submit', ''); // For PARENT tracking. See makeSubmitButton for sub button tracking
        encaps.appendChild(this.makeSubmitButton());
        return encaps;

      case "checkboxField":
        if(this.currentStyle['title'] == "MUS")
          input.setAttribute('value', 'Homeschool');
        else if (this.currentStyle['title'] == "SYS")
          input.setAttribute('value', 'Homeschool');

        input.setAttribute('type', elem);
        input.setAttribute('name', 'assign_to')
        input.setAttribute('style', this.currentStyle["CheckBoxes"]);
        
        encaps.appendChild(input);
        encaps.appendChild(label);
        return encaps;
      
      case "emailField":
        label.textContent = "Email";
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "telField":
        label.textContent = "Phone Number (format: XXX-XXX-XXXX)";
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        input.setAttribute('required', 'required');
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
        
      case "dateField":
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "passwdField":
        input.setAttribute('style', this.currentStyle["MajorInput"]);
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
        encaps.setAttribute('style',this.editor.General.ColorWheel);
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
        input.setAttribute('style', this.currentStyle["SelectBoxStyle"]);
        input.setAttribute('type', elem);
        input.setAttribute('name', 'state');
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
        container.setAttribute('data-dynaform', '');
        // fix this please
        container.setAttribute('style', 'width:90%;')
        label.textContent = "How can we help?";
        input.setAttribute('style', this.currentStyle['TextAreaStyle']);
        input.setAttribute('cols', '45');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'comments');
        encaps.appendChild(input);
        container.appendChild(label);
        container.appendChild(encaps);
        return container;
        
      default:
        console.log("Improbability Alert : silently failing!");
        console.log(`\n\nError : \n -- ${input} \n -- ${label} \n -- ${encaps} \n\n`);
        return null;
      }
    }

  openEditor = (idBy : string) : void => {
    
    // Acquire Editor space and get the corresponding editor from editor.editorNodes
    var editorWindow = document.getElementById('in-editor');
    var newEditorEls : HTMLElement;
    var oldNode : HTMLElement;
    
    // Populate Editor window accordingly
    if (this.history[0] == undefined)
      newEditorEls = null;
    else
      newEditorEls = <HTMLElement> this.editor.editorNodes(<string>this.history[this.history.length - 1]);


    //   newEditorEls = <HTMLElement> null;

    if (newEditorEls == null) {
      editorWindow.innerHTML = "<span id='ngsubmit-els-editor'>No editing options</span>";
      return;
    }

    // Remove old editor, append new one
    if (editorWindow.innerHTML){
      oldNode = document.getElementById('ngsubmit-els-editor') || 
                document.getElementById('ngsubmit-button-editor');
      oldNode.remove();
    }

    editorWindow.appendChild(newEditorEls);

    if (editorWindow.innerHTML)
    {
      /**
       * nglabeling is the EDITOR'S CURRENT INPUT FIELD.
  
       *          This is a refactor point.
       */
      let inField  = document.getElementById('nglabeling');
      let reqField = document.getElementById('ngrequirement') || null;
      
      // Things our Editor can do
      inField.addEventListener( 'input', (e)=>{this.changeLabel(e, idBy)} );

      if (reqField != null)
        reqField.addEventListener('input', (e)=>{this.changeRequirement(e)} );
    } 

    else return;

  }

  /** 
  *   NOTE : Casting an Event object is ALWAYS a bad idea. They are NOT polymorphic across events
  */

  changeLabel(e,  idBy : string) : void {

    /**
     *  Part of the Editor's functionality and (currently) allows us 
     *  to edit the label of the most recently added element.
     *  The event variable is of the next lower ordered functions stack frame
     */

    // Most recently added elem's <label>
    let lastFormLabel : Node;
    let formLabels : NodeList;

    // Most recently added submitButton's [value]
    let lastSubValue  : HTMLElement;
    let submitLabel   : NodeList;

    if (idBy == "subButtonField"){

      submitLabel = document.querySelectorAll('input[ng-sub]');
      lastSubValue = <HTMLElement> submitLabel[submitLabel.length - 1];
      lastSubValue.setAttribute('value',e.target.value);

    }
    else {

      // ng-anchor-label(s) exist on each of the rendering form's labels
      formLabels = document.querySelectorAll('.ng-anchor-label');
      
      lastFormLabel = formLabels[formLabels.length - 1]; // The last label that was added

      // Exit when we try to acquire a field without a label (i.e. submit)
      if(!lastFormLabel)
        return;

        lastFormLabel.textContent = e.target.value;

    }

  }

  changeRequirement (event) {
      /**
       * 
       * 
       * 
       *  You are here
       * 
       * 
       * 
       */
  }

  makeWidget(widget : string) : HTMLElement {
    /**
     *  TODO : MOVE THIS TO A SEPARATE CLASS
     *  Define the CONSTRUCTION of widgets here. 
     *  See ./html/htmleditor.ts->[Obj widgets] for the DEFINITION of styles, attr's, etc...
     *  Widgets are visible in expanded state until the HTML is exported.
     *  Define future widgets here.
     */
    let bootstrapEncaps = document.createElement('DIV');
    let label  = document.createElement('LABEL');
    let input  = document.createElement('INPUT');

    bootstrapEncaps.setAttribute('class', 'form-group');
    label.setAttribute('style', this.editor.General['LabelMargin']);

    switch(widget){

      case "schoolWidget" :
        
        var positionFieldContainer  = <HTMLElement> bootstrapEncaps.cloneNode(false);
        var schoolDistrictContainer = <HTMLElement> bootstrapEncaps.cloneNode(false);
        var schoolNameContainer = <HTMLElement> bootstrapEncaps.cloneNode(false);
        var outerContainer      = <HTMLElement> bootstrapEncaps.cloneNode(false);
        var positionField       = <HTMLElement> input.cloneNode(false);
        var schoolNameField     = <HTMLElement> input.cloneNode(false);
        var schoolDistField = <HTMLElement> input.cloneNode(false);
        var positionLabel   = <HTMLElement> label.cloneNode(false);
        var schoolNameLabel = <HTMLElement> label.cloneNode(false);
        var schoolDistLabel = <HTMLElement> label.cloneNode(false);

        // Setup inputs for each widget element
        positionField.setAttribute('class', 'input-xxlarge');
        positionField.setAttribute('id', 'position');
        positionField.setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"] + this.currentStyle["widgets"]["WidgetMajorMid"]);
        positionField.setAttribute('name', 'position');
        positionField.setAttribute('type', 'text');
        positionField.setAttribute('position-from-widget', '');

        schoolNameField.setAttribute('class', 'input-xxlarge');
        schoolNameField.setAttribute('id', 'school_name');
        schoolNameField.setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"]);
        schoolNameField.setAttribute('name', 'school_name');
        schoolNameField.setAttribute('type', 'text');
        
        schoolDistField.setAttribute('class', 'input-xxlarge');
        schoolDistField.setAttribute('id', 'school_district');
        schoolDistField.setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"]);
        schoolDistField.setAttribute('name', 'school_district');
        schoolDistField.setAttribute('type', 'text');

        // Setup widget labels
        positionLabel.innerText   = "Position";
        schoolNameLabel.innerText = "School Name";
        schoolDistLabel.innerText = "School District";

        // Setup Structure
        positionFieldContainer.appendChild(positionLabel);
        positionFieldContainer.appendChild(positionField);

        schoolNameContainer.appendChild(schoolNameLabel);
        schoolNameContainer.appendChild(schoolNameField);

        schoolDistrictContainer.appendChild(schoolDistLabel);
        schoolDistrictContainer.appendChild(schoolDistField);

        // Final form
        outerContainer.appendChild(positionFieldContainer)
        outerContainer.appendChild(schoolDistrictContainer)
        outerContainer.appendChild(schoolNameContainer)
 
        outerContainer.setAttribute('data-dynaform', '');
        outerContainer.setAttribute('data-widget-target', '');

        return outerContainer;

      // There is only one widget here.
      default :
        return;
    }
  }

  stylizer(style : string, bypass? : boolean) : void {

    // Fires when toggling between MUS / SYS

    /**
     *  This function has the highest likelihood to grow out of hand
     *  therefore style specificity should be achieved via tag name or attribute.
     *  Note that every dynamic element is acquired as a <NodeList> even if there is only 1
     */

    let container   = document.getElementById('consult-form-container');
    let deactivated = document.querySelector('.active');
    let button      = document.getElementById(<string> style); // change color & highlight
    let allInputs   = <NodeListOf<HTMLElement>> document.getElementsByTagName('input');
    let allTextbox  = document.getElementsByTagName('textarea');
    let allSelects  = document.getElementsByTagName('select');
    let allSubmits  = document.querySelectorAll('[ng-sub]');
    let allCheckbox = document.querySelectorAll('input[type=checkbox]');
    let allRadio    = document.querySelectorAll('input[type=radio]');
    let submitClass : string;
    let submitText  : string;

    // Style switch
    if (style == "MUS") { 
      this.currentStyle = this.musStyle;
      submitText = "lets go!";
      submitClass = "btn btn-large btn-success";
    }
    else if (style == "SYS") {
      this.currentStyle = this.sysStyle;
      submitText = "watch the webinar";
      submitClass = "btn btn-primary form-control";
    }

    if (!bypass){ // Will only bypass on initialization because nanoseconds count....

      // <Submit Buttons>
      for (let i = 0; i < allSubmits.length; i++){
        
        allSubmits[i].setAttribute('style', this.currentStyle["SubmitButtonStyles"]);
        allSubmits[i].setAttribute('value', submitText);
        allSubmits[i].setAttribute('class', submitClass);

      }
      // <Inputs>, skipping any submit types identified by the [ng-sub] attr.
      for(var i = 0; i < allInputs.length; i++)
        
        if (allInputs[i].getAttribute('type') == "text" || "email" || "password" || "tel") 
        {
          // Applies the style for the selected style
          if(!(allInputs[i].hasAttribute('ng-sub')))
            allInputs[i].setAttribute('style', this.currentStyle["MajorInput"]);

          // Always set the last input in the index to default, it's our option editor field.
          if (i == allInputs.length - 1)
            allInputs[i].setAttribute('style', this.editor.General["DefaultInputStyle"]);

          // WIDGETS : POTENTIAL (easily mitigated) CONFLICT - Widgets are only effected when they contain an input of the above if(types)
          if (allInputs[i].parentElement.hasAttribute('data-widget-target'))
            allInputs[i].setAttribute('style', this.currentStyle["WidgetMajor"]);
            if (allInputs[i].hasAttribute('position-from-widget'))
              allInputs[i].setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"] + this.currentStyle["widgets"]["WidgetMajorMid"]);
        }

      // <Textareas>
      for(let i = 0; i < allTextbox.length; i++)
        allTextbox[i].setAttribute('style', this.currentStyle["TextAreaStyle"]);

      // <Selects>
      for (let i = 0; i < allSelects.length; i++)
        allSelects[i].setAttribute('style', this.currentStyle["SelectBoxStyle"]);

      // <input[CHECKBOX]>
      for (let i = 0; i < allCheckbox.length; i++)
      {
        // if (i == allCheckbox.length - 1)
        //  continue;
        allCheckbox[i].setAttribute('style', this.currentStyle["Radio"]);
      }
      // <input[RADIO]>
      for (let i = 0; i < allRadio.length; i++)
      {
        // if (i == allCheckbox.length - 1)
        //  continue;
        allRadio[i].setAttribute('style', this.currentStyle["Radio"]);
      }
    }

    container.setAttribute("style", this.currentStyle["container"]);
    deactivated.classList.remove("active");
    button.classList.add("active");
    return;

  }

  displayHTML() : void {
    /**
     * Modal
     */
    this.modalActive  = true; 
    let theHTML       = document.getElementById('pretty-print');
    this.finalHTML    = <string> document.getElementById('view-form').innerHTML;
    this.modal        = document.getElementById('modal-html-view');

    // Display Modal and Dim the lights
    this.modal.style.display = "block";

    document.body.classList.add('raise-modal');
    theHTML.textContent = <string> this.finalHTML;
    
    return;
  }

  closeModal() : void {
    document.body.classList.remove('raise-modal');
    this.modal.style.display = "none";
    this.modalActive = false;
    return;
  }

  makeSubmitButton() : HTMLElement {
    let button = document.createElement('INPUT');
    button.setAttribute('id', 'leadGen');
    button.setAttribute('type', 'submit');
    button.setAttribute('disabled', '');
    button.setAttribute('ng-sub', '');
    button.setAttribute('style', this.currentStyle["SubmitButtonStyles"]);

    if (this.currentStyle["title"] == "MUS"){ // MUS Submit button flavor
      button.setAttribute('value', 'lets go!');
      button.setAttribute('class', 'btn btn-large btn-success');
    }
    else if (this.currentStyle['title'] == "SYS"){ // SYS Submit button flavor
      button.setAttribute('value', 'watch the webinar!');
      button.setAttribute('class', 'btn btn-primary form-control');
    }
    return button;
  }

  addCaptcha() : number {
    /**
     * Generate Recaptcha
     */
    let reCapchaElement = document.createElement('DIV');
    let form = document.getElementById('lead-gen-form-input');
    // Deploy attributes to recaptch DIV
    reCapchaElement.setAttribute('data-dynaform', '');
    reCapchaElement.setAttribute('class', 'g-recaptcha');
    reCapchaElement.setAttribute('data-sitekey', '6Lc3HWQUAAAAAAmrhK6RI77MSoHAmRH__OxEDDeB');   // The sitekey goes here
    reCapchaElement.setAttribute('data-callback', 'enableBtn');
    
    // append our completed captcha to the form
    form.appendChild(reCapchaElement);

    return 1;

  }

  getOutputDepth() : number {
    let outWindow = document.getElementById('pretty-print');
    let height    = outWindow.clientHeight;
    
    return height;
  }

}

