import { Component, OnInit } from '@angular/core';
import { Renderer } from '../../model/renderer';
import Editor from '../../html/htmleditor';

@Component({
  selector: 'app-renderable-item',
  templateUrl: './renderable-item.component.html',
  styleUrls: ['./renderable-item.component.css']
})
export class RenderableItemComponent implements OnInit {

  public renderer: Renderer;
  public form : Element;
  
  constructor() {
    this.form = document.getElementById('lead-gen-form-input');
  }

  ngOnInit() {
    this.renderer = new Renderer();
    
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
    
    // Create Editor View
    this.openEditor(identifiedBy, this.form);

    // Returns a formatted input view
    newInput = this.makeField(identifiedBy, elem);


    // Determine type
   

    // Send new input to the bottom of the form
    this.form.appendChild(newInput);
    console.log(this.form);

    console.log(elem);
    event.stopPropagation();
  }
  
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////
  makeField = (idBy : string, elem : string) : Element => {

    let newInput : Element;
    let auxNodes : Element; // i.e. <option> units
    let encap    : Element = document.createElement("P");
    let label    : Element = document.createElement("LABEL");
    let input    : Element = document.createElement("INPUT");

    switch (idBy) {
      case "nameField":
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

      case "passwField":
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

      default:
        break;
    }
    return encap;
  }

  openEditor = (idBy : string, form : Element):void => {

    var editorWindow = document.getElementById("in-editor");
    let newEditor = JSON.parse(String(Editor(idBy))) || null; // Contains an object of templates to render in the editor pane
    
    // null == undefined
    if (newEditor == null) {
      editorWindow.innerHTML = "";
      return;
    }

    // Apply Template to right
    editorWindow.innerHTML = newEditor[idBy];

    if (editorWindow.innerHTML)
    {
      let inField = document.getElementById("labeling");
      inField.addEventListener('input', (e)=>{this.changeLabel(e, idBy, form)} );
    } else return;
    console.log(newEditor);

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



  toCapcha() {
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