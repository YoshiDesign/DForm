import { Component, OnInit } from '@angular/core';
import { Renderer } from '../../model/renderer';
import Editor from '../../html/htmleditor';

@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {
  
  constructor() {}

  ngOnInit() {
    
  }

  toggleAdd(event, elem : string, identifiedBy : string){
    /* 
      Adds visible element to middle column 
      +localize 'attr' with scope visibility 
    */

    if (elem == null || undefined) {
      // Do nothing
      return;
    }

    let newInput : Element; // Encapsulated per the spec.
    var form = document.getElementById('lead-gen-form-input');
    
    // Create Editor View
    this.openEditor(identifiedBy, form);

    // Returns a formatted input view
    newInput = this.makeField(identifiedBy, elem);

    // Send new input to the next available field
    form.appendChild(newInput);

    event.stopPropagation();
  }
  
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////
  makeField = (idBy : string, elem : string) : Element => {

    let newInput : Element;
    let auxNodes : Element; // i.e. <option> units
    let encap    : Element = document.createElement("P");
    let label    : Element = document.createElement("LABEL");

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
        console.log("ENCAP" + encap);
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "emailField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "telField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "passwdField":
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
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      case "textareaField":
        input.setAttribute('type', elem);
        encap.appendChild(label);
        encap.appendChild(input);
        return encap;

      default:
        break;
    }
    return encap;
  }

  openEditor = (idBy : string, form : Element):void => {
    var editor       = new (Editor);
    var editorWindow = document.getElementById("in-editor");
    let newEditorEls = JSON.parse(String(editor.editorNodes(idBy))) || null; // Contains an object of templates to render in the editor pane
    
    // null == undefined
    if (newEditorEls == null) {
      editorWindow.innerHTML = "";
      return;
    }

    // Apply Template to right
    editorWindow.innerHTML = newEditorEls[idBy];

    if (editorWindow.innerHTML)
    {
      let inField = document.getElementById("nglabeling");
      inField.addEventListener('input', (e)=>{this.changeLabel(e, idBy, form)} );
    } else return;
    console.log(newEditorEls);

  }

  changeLabel(e , idBy : string, form : Element) : void {

    /**
     *  Part of the Editor's functionality and allows us 
     *  to edit the label of the most recently added element
     * 'e' refers to the previous stack frame's (function's) event listener, 'input'
     */

    // Most recent elem added
    let lastFormLabel = form
        .lastElementChild
        .previousElementSibling.previousElementSibling;

    console.log(`LAST FORM LABEL ${lastFormLabel}`);
    
    lastFormLabel.innerHTML = e.target.value;
    
    console.log("changeDetected");
  }



  toCapcha(form : Element) {
    /*
       Recaptcha factory function
       Gets called post form completion
    */
    console.log("click");
    let reCapchaElement = document.createElement("DIV");
    
    reCapchaElement.setAttribute('class', 'g-recaptcha');
    reCapchaElement.setAttribute('data-sitekey', '6Lc3HWQUAAAAAAmrhK6RI77MSoHAmRH__OxEDDeB');

  // append our completed captcha to the form
    form.appendChild(reCapchaElement);

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