import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';
import Widgeteer from '../../widgeteer/widgeteer';
import { ResourceManager } from '../../resourceManager/resource-manager';
import { Input } from '@angular/compiler/src/core';



@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {

  public editor       : Editor;          // Custom class. Defines our styles, Option editor inputs and other static items.
  public widgeteer    : Widgeteer;
  public resourceMgr  : ResourceManager;
  public illegalInputEvent  : RegExp;
  public illegalInputScript : RegExp;
  public modalActive  : Boolean;
  public whichStyle   : Boolean;
  public activeSchoolWidget : Boolean;
  public finalHTML    : String;
  public musStyle     : Object;
  public sysStyle     : Object; 
  public currentStyle : Object;    // Either "MUS" or "SYS". "MUS" as Default
  public history  : Array <string>; // History does NOT sync via querying the page. It requires sync during toggleAdd & toggleRemove
  public optLabel : HTMLElement;
  public modal    : HTMLElement;
  public theForm  : HTMLElement;
  
  constructor() {
    this.history = [];
  }
  
  ngOnInit() {
    this.modalActive          = false;
    this.resourceMgr = new ResourceManager;
    this.editor     = new Editor;
    this.widgeteer  = new Widgeteer;
    this.openEditor("noField");
    this.setWindowHeight();
    // start with MUS style
    this.musStyle     = this.editor.MUS;
    this.sysStyle     = this.editor.SYS;
    this.currentStyle = this.musStyle;  
    this.optLabel = document.getElementById('editor-title');
    this.theForm = document.getElementById('lead-gen-form-input'); // Acquires the <form>
    this.stylizer(this.currentStyle["title"], true);
    
    // currently all dynamic HTML is disabled by default so these are useless.
    // this.illegalInputEvent = /"\bon[A-Z]+"/;
    // this.illegalInputScript = /"\b<script>"/;
  }

  toggleAdd(
    event, 
    elem : string, 
    identifiedBy : string, 
    otherOpt? : number
  ) {
    /** 
    *   otherOpt is a universal flag for optional behavior. See makeField()s docstring
    */
    let form = document.getElementById('lead-gen-form-input');
    let newInput : Element; // Encapsulated per the page spec.

    if (elem == null || undefined) {
      // Do nothing
      return;
    }

    // Sync the order of elements being inserted
    this.history.push(<string> identifiedBy);

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
    this.updateRequired();
    event.stopPropagation();
  }

  toggleRemove(
    clearAll? : Boolean, 
  ) : void {

    this.updateRequired();
    
    let isItaWidget = document.querySelectorAll('[data-widget-target]') || null;
    let widgetsLength = isItaWidget.length;
    let allLength = this.theForm.children.length; // Length of all <form>'s children

    console.log(this.history);

    if(clearAll)
    {
      this.history = [];
      this.openEditor("noField");
      this.optLabel.innerText = "Options";
      
      var allNewFields = document.querySelectorAll('div[data-dynaform]');
      for (let i  in allNewFields){
        if (i == "length") // moot : last element of a <NodeList> is its own length. This silences a pointless error.
          break
        allNewFields[i].parentNode.removeChild(allNewFields[i]);
      }

      // So we can enable the ability to add a school widget again
      this.activeSchoolWidget = false;

      return;
    }

    /**
     * Handle widget reduction
     */

    // If there is a widget and it is at the "front of the line"
    if (isItaWidget && 
      this.theForm.children[allLength - 1]
      .hasAttribute("data-widget-target"))
    {
      
      // Which widget is it?
      if (isItaWidget[widgetsLength - 1].id == "school-widget")
        this.activeSchoolWidget = false;
    }

    // Update history
    this.history.pop();

    // Display based on last history element
    this.openEditor(this.history[this.history.length - 1]);
    
    // Sanity check
    // let dontRemove = <HTMLElement>this.theForm.childNodes[allLength-1];
    // if (!(dontRemove.hasAttribute('data-dynaform')))
    //   return;
    // else  

    // Remove most recently added form field
    this.theForm.removeChild(this.theForm.childNodes[allLength - 1]);

    this.updateRequired();
    
  }

  updateRequired () {
    
    // This fn checks the requirement status of the latest form field and updates the editors "required" checkbox
    let reqField = document.getElementById('ngrequirement') || null;
    let allInputs = document.querySelectorAll('[data-ng-el]');

    if (reqField == null)
      return;

      if (allInputs.length != 0) {

        if (allInputs[allInputs.length - 1].hasAttribute('required')) {

          reqField.setAttribute('checked', '');
        }
        else {

          reqField.removeAttribute('checked');
        }
      }
    
  }

  makeField (
    elem : string, 
    idBy : string, 
    otherOpt? : number
  ) : Element {

    // <HTMLElement> factory for the form to be generated

    /** 
     * Other Option Values : 
     * 
     *    0 == (null)
     *    1 == make a last name input instead of a first name input
     *    2 == make an address_2 field
     */

    
    if (elem == "widget")
        return this.makeWidget(idBy);
    else if (idBy == "heading")
        return this.makeHeading(elem);

    var auxNodes : Object; // i.e. <option> units for select boxes
    let encaps   : Element = document.createElement("DIV");
    let label    : Element = document.createElement("LABEL");
    
    // determine node
    if (elem == "select")
      var input : Element = document.createElement("SELECT");
    else if (elem == "textarea") {
      var input : Element = document.createElement("TEXTAREA");
      input.setAttribute("rows", "3");
    } else
      var input : Element = document.createElement("INPUT");
    
    // Tracking Attribute for any input that is not a submit or in a widget
    input.setAttribute('data-ng-el', 'true');

    // Tracking & class
    label.classList.add("ng-anchor-label");
    label.classList.add("control-label");

    // Tracking & class
    encaps.setAttribute('data-dynaform', '');
    encaps.classList.add("form-group");

    // Apply Bootstrap Classes to proper nodes. checkbox and radio are pre-styled
    if (idBy != "checkboxField" && idBy != "radioField")
      input.classList.add("form-control");

    /**
     *  This switch appends Elements and applies Attributes / Styles and allocates form units
     *  [otherOpt] current flags are enumerated in the DocString at the top of the function.
     */

    // Factory
    switch (idBy) {
      // safety first.
      case "recaptchaField":
        // punt to recap
        this.addCaptcha();
        return null;

      case "nameField":

        if(otherOpt == 1) {
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

      case "addressField":

        if (otherOpt == 2) {
          label.textContent = "Address 2";
          input.setAttribute('name', 'address_2');
        } else {
          input.setAttribute('name', 'address_1');
          label.textContent = "Address 1";
        }
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "subButtonField":
        encaps.setAttribute('data-dyna-submit', ''); // For PARENT tracking. See makeSubmitButton for sub button tracking
        encaps.appendChild(this.makeSubmitButton());
        return encaps;

      case "checkboxField":
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["CheckBoxes"]);
        input.setAttribute('required', 'required');
        encaps.appendChild(input);
        encaps.appendChild(label);
        return encaps;
      
      case "emailField":
        label.textContent = "Email";
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'email');
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
      
      case "zipField" :
        label.textContent = "Zip Code";
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'zip_code');
        input.setAttribute('style', this.currentStyle['MinorInput'] + this.editor.General["rightAlign"]);
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
        input.setAttribute('style', this.currentStyle["DateStyle"]);
        input.setAttribute('required', 'required');
        input.setAttribute('type', elem);
        input.setAttribute('name', 'date');
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "passwdField":
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        input.setAttribute('required', 'required');
        label.textContent = "Password";
        input.setAttribute('type', elem);
        input.setAttribute('name', 'password');
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "fileField":
        input.setAttribute('style', this.currentStyle['FileStyle']);
        input.setAttribute('type', elem);
        input.setAttribute('name', 'file-field');
        input.setAttribute('required', 'required');
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;
      
      case "numberField":
        label.textContent = "Qty.";
        input.setAttribute('style', this.currentStyle['QtyStyle']);
        input.setAttribute('name', 'quantity');
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "colorField":
        label.textContent = "Pick Color";
        input.setAttribute('type', elem);
        input.setAttribute('name','color');
        encaps.appendChild(label);
        encaps.appendChild(input);
        input.setAttribute('style',this.editor.General["ColorWheel"]);
        return encaps;
        
      case "rangeField":
        input.setAttribute('type', elem);
        input.setAttribute('name', 'in-range');
        input.setAttribute('style', this.currentStyle["RangeStyle"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "selectField":
        // An object containing States & Abbreviatiosns as k:v respectively.
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
        input.setAttribute('required', 'required');
        input.setAttribute('name', 'state');
        encaps.appendChild(label);
        encaps.appendChild(input);
        
        return encaps;
        
      case "timeField":
        input.setAttribute('style', this.currentStyle["TimeStyle"]);
        input.setAttribute('type', elem);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "radioField":
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["CheckBoxes"]);
        encaps.appendChild(input);
        encaps.appendChild(label);
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

  openEditor (
    idBy : string
  ) : void {
    
    // Acquire Editor space and get the corresponding editor from editor.editorNodes
    var editorWindow = document.getElementById('in-editor');
    var newEditorEls : HTMLElement;
    var oldNode : HTMLElement;
    
    console.log(this.history);

    // Populate Editor window accordingly
    if (this.history[0] == undefined)
      newEditorEls = null;
    else
      newEditorEls = <HTMLElement> this.editor
      .editorNodes(<string>this.history[this.history.length - 1]);

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

    // Add 
    editorWindow.appendChild(newEditorEls);

    if (editorWindow.innerHTML)
    {
      /**
       * nglabeling is the EDITOR'S CURRENT INPUT FIELD.
       */
      
      let inField  = document.getElementById('nglabeling');
      let reqField = document.getElementById('ngrequirement') || null;

      inField.setAttribute('data-default', '');

      // Large Editor Label
      this.optLabel.innerText = "Options";

      /**
       * Things our editor can do
       */

      // Live label editing
      inField.addEventListener( 'input', (e)=>{this.changeLabel(e, idBy)} );

      // Add or remove [required]
      if (reqField != null) {
        reqField.setAttribute('data-default', '');
        reqField.addEventListener('input', (e)=>{this.changeRequirement(e)} );
      } else return;

    }
  }

  /** 
  *   NOTE : Casting to an Event object is a bad idea. They are NOT the same object for every event.
  */

  changeLabel (
    evt,  
    idBy : string
  ) : void {

    /**
    *   This is a keystroke listener for the editor
    *   The event variable is of the next lower ordered functions stack frame
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
      lastSubValue.setAttribute('value', evt.target.value);

    }
    else if (idBy == "heading")
    {
      var headingLabel = <NodeList> document.querySelectorAll("[data-heading-anchor]");

      var lastHeading  = <HTMLElement> headingLabel[headingLabel.length - 1];

      lastHeading.textContent = evt.target.value;
    }
    else if (idBy == "schoolWidget") {
      var assignTo = document.getElementById("assign_to");
      assignTo.setAttribute('value', evt.target.value);
    }
    else {

      // ng-anchor-label(s) exist on each of the rendering form's labels
      formLabels = document.querySelectorAll('.ng-anchor-label');
      
      // The last label that was added
      lastFormLabel = formLabels[formLabels.length - 1]; 

      // Exit when we try to acquire a field without a label
      if(!lastFormLabel)
        return;

      lastFormLabel.textContent = evt.target.value;

    }

  }

  changeRequirement (
    evt
  ) : void {

    /**
     * Control the checkedness of the editors requirement checkbox
     */

    // Every generated element on the screen. Sans submit btns
    let enabledItems = document.querySelectorAll('[data-ng-el]');
    // the most recent addition
    let currentItem = enabledItems[enabledItems.length - 1];

    // Check the box in the editor on init
    if (currentItem.hasAttribute("required"))
      evt.target.setAttribute("checked",'');

    // Response to editor's 'required' checkbox
    if (evt.target.checked) {
      currentItem.setAttribute("required", "required");
    } else if (!evt.target.checked) {
      currentItem.removeAttribute("required");
    }

  }

  makeHeading(
    elem : string
  ) : HTMLElement {
    /**
     * Create customizeable headings
     */
    let headingContainer = document.createElement("DIV");
    let heading : HTMLElement;

    // Using a switch in case we add more heading types
    switch (elem){

      case "headingTwo":
        let headingTwo = document.createElement("H3");
        headingTwo.innerText = "Edit Your Title!";
        headingContainer.appendChild(headingTwo);

    }

    headingContainer.setAttribute("data-dynaform", "");
    heading = <HTMLElement> headingContainer.firstChild;
    heading.setAttribute('data-heading-anchor', '');
    
    return headingContainer;

  }
 
  makeWidget(
    widget : string
  ) : Element {
    /**
     *  See ./html/htmleditor.ts->[Obj widgets] for the DEFINITION of styles, attr's, etc...
     *  Widgets are visible in expanded state until the HTML is exported.
     */

    switch(widget) {
      
      case "schoolWidget" :
        this.activeSchoolWidget = true;
        break;
      case "ResourceMonitor":
        this.resourceMgr.resourceMonitorOpen = true;
        break;
      default :
        return;

    }

    return this.widgeteer.makeWidget(widget, this.currentStyle, this.editor.General);

  }

  copy2clip () : void {

    let copyText = <HTMLTextAreaElement> document.getElementById("pretty-print");
    let copied = document.getElementById('copy-btn');
    copyText.select();
    document.execCommand("copy");
    copied.innerHTML = "Copied &#x1f44d;";

  }

  stylizer (
    style : string, 
    bypass? : boolean
  ) : void {

    // Fires when toggling between MUS / SYS : Not from initialization

    /**
     *  This function has the highest likelihood to grow out of hand
     *  therefore style specificity should be achieved via tag name or attribute.
     *  Note that every dynamic element is acquired as a <NodeList> even if there is only 1
     */

    let container   = document.getElementById('consult-form-container');

    let editorfield = <HTMLInputElement> document.getElementById('nglabeling');
    if (editorfield)
      editorfield.value = "";

    let deactivated = document.querySelector('.active');
    let button      = document.getElementById(<string> style); // change color & highlight
    let allInputs   = <NodeListOf<HTMLElement>> document.getElementsByTagName('input');
    let allTextbox  = document.getElementsByTagName('textarea');
    let allSelects  = document.getElementsByTagName('select');
    let allSubmits  = document.querySelectorAll('[ng-sub]');
    let allFileField = document.querySelectorAll('input[type=file]');
    let allQtyFields = document.querySelectorAll('input[type=number]');
    let allCheckbox = document.querySelectorAll('input[type=checkbox]');
    let allRadio    = document.querySelectorAll('input[type=radio]');
    let allRange    = document.querySelectorAll('input[type=range]');
    let allDates    = document.querySelectorAll('input[type=date]');
    let allTimes    = document.querySelectorAll('input[type=time]');
    let allColor    = document.querySelectorAll('input[type=color]');
    let ignore      = document.querySelectorAll('[data-resource-field]');
    let submitClass : string;
    let submitText  : string;

    // Differentiate submit button text
    if (style == "MUS") { 
      this.whichStyle = true;
      this.currentStyle = this.musStyle;
      submitText = "lets go!";
      submitClass = "btn btn-large btn-success";
    }
    else if (style == "SYS") {
      this.whichStyle = false;
      this.currentStyle = this.sysStyle;
      submitText = "watch the webinar";
      submitClass = "btn btn-primary form-control";
    }

    if (!bypass){ // Will only bypass on initialization because nanoseconds ...

      // <Submit Buttons>
      for (let i = 0; i < allSubmits.length; i++){
        
        // <moot> The loop implies that there could be more than one submit button to stylize </moot>
        allSubmits[i].setAttribute('style', this.currentStyle["SubmitButtonStyles"]);
        allSubmits[i].setAttribute('value', submitText);
        allSubmits[i].setAttribute('class', submitClass);

      }
      // <Inputs>, skipping any submit types identified by the [ng-sub] attr.
      for(var i = 0; i < allInputs.length; i++) {
        if (allInputs[i].getAttribute('type') == "hidden")
          continue;
        if (allInputs[i].getAttribute('type') == "text" || "email" || "password" || "tel") 
        {
          // Relates to option editor
          if (allInputs[i].hasAttribute('data-default'))
            continue;

          if (allInputs[i].getAttribute("name") == "zip_code") {
            allInputs[i].setAttribute('style', this.currentStyle["MinorInput"]);
            continue;
          }

          // Applies the style for the selected style
          if (!(allInputs[i].hasAttribute('ng-sub')))
            allInputs[i].setAttribute('style', this.currentStyle["MajorInput"]);

          // WIDGETS : POTENTIAL (easily mitigated) CONFLICT - Widgets are only effected when they contain an input of the above if(types) i.e. text || email...etc
          if (allInputs[i].parentElement.hasAttribute('data-widget-target'))
            allInputs[i].setAttribute('style', this.currentStyle["WidgetMajor"]);
            if (allInputs[i].hasAttribute('position-from-widget'))
              allInputs[i].setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"]);
        }
      }
      // <Textarea>
      for(let i = 0; i < allTextbox.length; i++){
        if (allTextbox[i].id == "pretty-print")
          continue;
        allTextbox[i].setAttribute('style', this.currentStyle["TextAreaStyle"]);
      }

      // <Select>
      for (let i = 0; i < allSelects.length; i++)
        allSelects[i].setAttribute('style', this.currentStyle["SelectBoxStyle"]);

      // input[CHECKBOX]
      for (let i = 0; i < allCheckbox.length; i++)
        allCheckbox[i].setAttribute('style', this.currentStyle["Radio"]);
      
      // input[RADIO]
      for (let i = 0; i < allRadio.length; i++)
        allRadio[i].setAttribute('style', this.currentStyle["Radio"]);

      // input[Range]
      for (let i = 0; i < allRange.length; i++)
        allRange[i].setAttribute("style", this.currentStyle["RangeStyle"]);

      // input[file]
      for (let i = 0; i < allFileField.length; i++)
        allFileField[i].setAttribute("style", this.currentStyle["FileStyle"]);

      // input[number]
      for (let i = 0; i < allQtyFields.length; i++)
        allQtyFields[i].setAttribute("style", this.currentStyle["QtyStyle"]);

      // input[date]
      for (let i = 0; i < allDates.length; i++)
        allDates[i].setAttribute("style", this.currentStyle['DateStyle']);

      // input[time]
      for (let i = 0; i < allTimes.length; i++)
        allTimes[i].setAttribute("style", this.currentStyle['TimeStyle']);

      // input[color]
      for (let i = 0; i < allColor.length; i++)
        allColor[i].setAttribute("style", this.currentStyle['ColorStyle']);

    }

    // Apply encompassing style
    container.setAttribute("style", this.currentStyle["container"]);

    // Dont overwrite resource monitor window styles
    for (var i = 0 ; i < ignore.length ; i++) 
    {
      for (var j = 0 ; j < ignore[i].children.length ; j++)
      {
        ignore[i].children[j].setAttribute('style', '');	
      }
    }

    // target the previously active .active and remove the class
    deactivated.classList.remove("active");

    // activate our selected button
    button.classList.add("active");
    return;

  }
  configureWidgets (
    widget : HTMLElement, 
    reset = false
  ) : void {

    /**
     *  Type of widget is the ID value of the outer-most div of the widget
     * 
     *  Export or retract widget final state
     */

    let typeOfWidget = widget.id;

    // Being very explicit with if-statements here...
    if (typeOfWidget == "school-widget" && !reset) {
      // School Widget : set inner container display to none
      let changeVis = document.getElementById('schools');
      changeVis.setAttribute('style', this.editor.General['noDisplay']);
    }
    else if (typeOfWidget == "school-widget" && reset)
    {
      let changeVis = document.getElementById('schools');
      changeVis.removeAttribute('style');
    }

    return;
  }

  displayHTML() : void {
    /**
     * Modal
     */
    this.modalActive  = true; 
    let theHTML       = document.getElementById('pretty-print');
    this.modal        = document.getElementById('modal-html-view');
    let isThereAwidget = document.querySelectorAll('[data-widget-target]') || null;

    /** 
     *  Widgets need 1 general identifier and 1 unique identifier
     *  Respectively answering : Is there a widget? Which widget is it? <-- fun to say
     *  General Identifier = attr[data-widget-target]
     */

    if (isThereAwidget)
      for (let i = 0; i < isThereAwidget.length; i++)
        this.configureWidgets(<HTMLElement>isThereAwidget[i]);

    this.finalHTML    = <string> document.getElementById('sub-view').innerHTML;
    // Display Modal and Dim the lights
    this.modal.style.display = "block";

    document.body.classList.add('raise-modal');
    theHTML.textContent = <string> this.finalHTML;
    
    return;
  }

  closeModal() : void {
    let copied = document.getElementById("copy-btn");
    copied.innerHTML = "copy";

    document.body.classList.remove('raise-modal');
    this.modal.style.display = "none";
    this.modalActive = false;

    // Undo widget finalized state
    let findWidgets = <NodeList> document.querySelectorAll('[data-widget-target]') || null;
    if (findWidgets)
      for (let i = 0; i < findWidgets.length; i++) {
        this.configureWidgets(<HTMLElement>findWidgets[i], true);
      }
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

  setWindowHeight() : void {
    let mainWindow = document.getElementsByClassName('main-window')[0];
    let pageBody = document.getElementsByTagName('body')[0];
    let height = pageBody.clientHeight;
    let adjustHeight = height - (height * 0.4);
    
    mainWindow.setAttribute('style', `
      z-index:1000;
      display: flex;
      background: rgb(255, 255, 255);
      margin:25px 175px 175px 175px;
      height :
      ${String(height - adjustHeight + 70)}px`);

  }
}

