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
  public input;
  public form;
  
  constructor() { }

  ngOnInit() {
    this.renderer = new Renderer();
    this.form = document.getElementById('lead-gen-form-input');
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
    var newInput  = null;
    var auxNodes  = null; // i.e. <option> units
    var encapsul  = document.createElement("P");
    var label     = document.createElement("LABEL");

    this.openEditor(identifiedBy);

    if (elem != "textarea" && elem != "select"){
      
      newInput = document.createElement("INPUT");

      console.log(`EVENT ${event.target.test}`);
      console.log(`${elem}`);
    } else if (elem == "textarea"){
      newInput = document.createElement("TEXTAREA");
      console.log(`${elem}`);
    } else {
      newInput = document.createElement("SELECT");
      // BUILD-SELECT FUNTION
    }

    // Determine type
    newInput.setAttribute('type', elem);

    // Send new input to the bottom of the form
    this.form.appendChild(newInput);
    console.log(this.form);

    console.log(elem);
    event.stopPropagation();
  }
  
///////////////////////Remember to Delete Editor upon completion///////////////////////////////////

  openEditor = (idBy : string):void => {
    var editorWindow = document.getElementById("in-editor");
    let newEditor = JSON.parse(String(Editor(idBy))) || null;
    if (newEditor == null) return;
    editorWindow.innerHTML = newEditor[idBy];

    console.log(newEditor);
    
  }


  
  changeLabel(e){

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