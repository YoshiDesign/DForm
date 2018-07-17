import { Component, OnInit } from '@angular/core';
import Editor from '../../html/htmleditor';



@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {

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
    console.log("up");
    this.modalActive = false;
    this.editor = new Editor;
    var form = document.getElementById('lead-gen-form-input');
    // start with MUS style
    this.musStyle = this.editor.MUS;
    this.sysStyle = this.editor.SYS;
    this.currentStyle = this.musStyle;
    this.stylizer(this.currentStyle["title"], true);
    
    // currently all dynamic HTML is disabled by default so these are useless.
    // this.illegalInputEvent = /"\bon[A-Z]+"/;
    // this.illegalInputScript = /"\b<script>"/;
  }
  
  toggleAdd(event, elem : string, identifiedBy : string, otherOpt? : number){
    /** 
    *   Adds visible element to middle column.
    *   otherOpt is a universal flag for transitive state.
    *   +localize 'attr' with scope visibility.
    */
    let form = document.getElementById('lead-gen-form-input');
    let newInput : Element; // Encapsulated per the page spec.

    if (elem == null || undefined) {
      // Do nothing
      return;
    }

    // Create Editor View
    this.openEditor(identifiedBy);

    // Standard enter here
    if (!otherOpt)
      newInput = this.makeField(<string> elem,
                                <string> identifiedBy);
    else // otherOpt is a universal flag. See the docstring in makeField()
      newInput = this.makeField(<string> elem,
                                <string> identifiedBy,
                                <number> otherOpt);

    // Recaptcha is appended throught the addCaptcha() function
    if (elem == "recaptcha")
      return;

    // Send new input to the next available field
    form.appendChild(newInput);

    event.stopPropagation();
  }

  removeRecent(clearAll? : Boolean) : void {
    let findMostRecentField = document.getElementById('lead-gen-form-input');
    if(clearAll)
    {
      var allNewFields = document.querySelectorAll("div[data-dynaform]");
      for (let i  in allNewFields){
        if (i == "length") // moot : last element of a <NodeList> is its own length. This silences a pointless error.
          break
        allNewFields[i].parentNode.removeChild(allNewFields[i]);
      }
      return;
    }
    
    
    let length = findMostRecentField.childNodes.length;
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

    var auxNodes : Object; // i.e. <option> units
    let encaps   : Element = document.createElement("DIV");
    let label    : Element = document.createElement("LABEL");

    // determine inner node
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
    encaps.setAttribute('data-dynaform', ''); // tracking
    
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
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        input.setAttribute('required', 'required');
        input.setAttribute('id', 'first-name');
        input.setAttribute('type', elem);

        encaps.appendChild(label);
        encaps.appendChild(input);
        
        return encaps;

      case "subButtonField":
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
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["MajorInput"]);
        encaps.appendChild(label);
        encaps.appendChild(input);
        return encaps;

      case "telField":
        label.textContent = "Phone Number (format: XXX-XXX-XXXX)";
        input.setAttribute('type', elem);
        input.setAttribute('style', this.currentStyle["MajorInput"]);
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
        input.setAttribute('style', this.currentStyle['SelectBox']);
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
        input.setAttribute('style', this.currentStyle['TextAreaHelp']);
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
    
    lastFormLabel = FormLabels[FormLabels.length - 1];

    // Exit when we try to acquire a field without a label (i.e. submit)
    if(!lastFormLabel)
      return;

    lastFormLabel.textContent = e.target.value;
    
    
  }

  makeWidget(widget : string) : HTMLElement {
    /**
     *  Define the CONSTRUCTION of widgets here.
     *  See ./html/htmleditor.ts->[Obj widgets] for the DEFINITION of styles, attr's, etc...
     *  Widgets are visible in expanded state until the HTML is exported.
     *  Define future widgets here.
     */
    let bootstrapEncaps = document.createElement("DIV");
    let label  = document.createElement("LABEL");
    let input  = document.createElement("INPUT");

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
        positionField.setAttribute('style', this.currentStyle["widgets"]["WidgetMajor"] + this.currentStyle["widgets"]['WidgetMajorMid']);
        positionField.setAttribute('name', 'position');
        positionField.setAttribute('type', 'text');

        schoolNameField.setAttribute('class', 'input-xxlarge');
        schoolNameField.setAttribute('id', 'school_name');
        schoolNameField.setAttribute('style', this.currentStyle["widgets"]['WidgetMajor']);
        schoolNameField.setAttribute('name', 'school_name');
        schoolNameField.setAttribute('type', 'text');
        
        schoolDistField.setAttribute('class', 'input-xxlarge');
        schoolDistField.setAttribute('id', 'school_district');
        schoolDistField.setAttribute('style', this.currentStyle["widgets"]['WidgetMajor']);
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
 
        outerContainer.setAttribute("data-dynaform", '');

        return outerContainer;

      // There is only one widget here.
      default :
        return;
    }
  }

  stylizer(style : string, bypass? : boolean) : void {

    // Toggle between styles for MUS vs SYS

    /**
     *  This function has the highest likelihood to grow out of hand
     *  Specificity should be allocated accordingly
     */

    let container   = document.getElementById('consult-form-container');
    let deactivated = document.querySelector('.active');
    let button      = document.getElementById(<string> style); // change color & highlight
    let allInputs   = <NodeListOf<HTMLElement>> document.getElementsByTagName("input");
    let allTextbox  = document.getElementsByTagName("textarea");
    let newSubmitBtns  = document.querySelectorAll("input[type=submit]");
    let subButtonParent : NodeList;

    if (style == "MUS")  {  

      this.currentStyle = this.musStyle;

      if (!bypass){

        subButtonParent = document.querySelectorAll(".form-group");
        /**
         * 
         *  You are here
         * 
         * 
         * 
         *  Target current on-screen btn
         * 
         * 
         */

        for(let i = 0; i < allInputs.length; i++)
        {
          if (allInputs[i].getAttribute('type') == "text" || "email" || "password" || "tel")
            allInputs[i].setAttribute('style', this.currentStyle["MajorInput"]);

        }
        
        for (let i = 0; i < allTextbox.length; i++)
          allTextbox[i].setAttribute('style', this.currentStyle["MajorInput"]);
      }
    }
    else if (style == "SYS") {   
      this.currentStyle = this.sysStyle;
      if (!bypass){
        for(let i = 0; i < allInputs.length; i++)
        {
          if (allInputs[i].getAttribute('type') == "text" || "email" || "password" || "tel")
            allInputs[i].setAttribute('style', this.currentStyle["MajorInput"]);
        }
        for (let i = 0; i < allTextbox.length; i++)
          allTextbox[i].setAttribute('style', this.currentStyle["MajorInput"]);
      }
    }

    container.setAttribute("style", this.currentStyle['container']);
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
    let button = document.createElement("INPUT");
    button.setAttribute('id', 'leadGen');
    button.setAttribute('type', 'submit');
    button.setAttribute('disabled', '');
    button.setAttribute('ng-sub', '');
    button.setAttribute('style', this.currentStyle['SubmitButtonStyles']);

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

