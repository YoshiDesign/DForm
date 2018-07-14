import { Component, OnInit } from '@angular/core';
import { Renderer } from '../../model/renderer'

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
    this.form = document.getElementById('template-form');
  }

  toggleAdd(e, elem : string){
    /* 
      Adds visible element to middle column 

      localize 'attr' with scope visibility 
    */
    
    var newInput  = null;
  
    console.log(this.form);

    // 
    if (elem != "textarea"){
      newInput = document.createElement("INPUT");
      console.log(`${elem}`);
    } else {
      newInput = document.createElement("TEXTAREA");
      console.log(`${elem}`);
    }

    // Determine type
    newInput.setAttribute('type', elem);

    // newInput.setAttributeNode(classAttributeNode);
    this.form.appendChild(newInput);
    console.log(this.form);

    /* 
      acquire parent node from + symbol
      to subsequently acquire id as input type
    */
    console.log(elem);

    e.stopPropagation();
  }

  toCapcha() {

    /*
       Recaptcha factory function
    */
    console.log("click");
    let reCapchaElement = document.createElement("DIV");
    
    reCapchaElement.setAttribute('class', 'g-recaptcha');
    reCapchaElement.setAttribute('data-sitekey', '6Lc3HWQUAAAAAAmrhK6RI77MSoHAmRH__OxEDDeB');

  // //   let reCapchaFirst   = document.createElement("DIV");
  //   let reCapchaSecond  = document.createElement("DIV");
  //   let reCapchaThird   = document.createElement("DIV");
  //   let reCapchaFour    = document.createElement("iframe");
  //   let reCapchaResponseField = document.createElement("TEXTAREA");

  //   // CONSTRUCT RECAPCHA L_ONE >> <div class='g-recaptcha' data-sitekey='6Lfc8Q0UAAAAAOg8v3w8RKgSi2Fy03sllae2HT7r' data-callback='enableBtn'>
  //   // reCapchaFirst.setAttribute('class', 'g-recapcha');
  //   // reCapchaFirst.setAttribute('data-sitekey', '6Lfc8Q0UAAAAAOg8v3w8RKgSi2Fy03sllae2HT7r');
  //   // reCapchaFirst.setAttribute('data-callback', 'enableBtn');

  //   // CONSTRUCT RECAPCHA L_TWO >> <div style='width: 304px; height: 78px;'><div>
  //   reCapchaSecond.setAttribute('style', 'width: 304px; height: 78px;');

  //   //CONSTRUCT RECAPCHA L_FOUR >> <iframe src="https://www.google.com/recaptcha/api2/anchor?ar=1&amp;k=6Lfc8Q0UAAAAAOg8v3w8RKgSi2Fy03sllae2HT7r&amp;co=aHR0cHM6Ly9kZW1tZWxlYXJuaW5nLmNvbTo0NDM.&amp;hl=en&amp;v=v1531117903872&amp;size=normal&amp;cb=a5l8neaa8gbj" width="304" height="78" role="presentation" frameborder="0" scrolling="no" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox"></iframe>
  //   reCapchaFour.setAttribute('width', '304');
  //   reCapchaFour.setAttribute('height', '78');
  //   reCapchaFour.setAttribute('role', 'presentation');
  //   reCapchaFour.setAttribute('frameborder','0');
  //   reCapchaFour.setAttribute('scrolling','no');
  //   reCapchaFour.setAttribute('sandbox', '\
  //     allow-forms\
  //     allow-popups \
  //     allow-same-origin \
  //     allow-scripts \
  //     allow-top-navigation \
  //     allow-modals \
  //     allow-popups-to-escape-sandbox\
  //   ');
  // reCapchaFour.setAttribute('src', 'https://www.google.com/recaptcha/api2/anchor?ar=1&amp;k=6Lfc8Q0UAAAAAOg8v3w8RKgSi2Fy03sllae2HT7r&amp;co=aHR0cHM6Ly9kZW1tZWxlYXJuaW5nLmNvbTo0NDM.&amp;hl=en&amp;v=v1531117903872&amp;size=normal&amp;cb=a5l8neaa8gbj');
  // // CONSTRUCT RECAPCHA RESPONSE FIELD
  // //     <textarea 
  // //        id="g-recaptcha-response" 
  // //        name="g-recaptcha-response" 
  // //        class="g-recaptcha-response" 
  // //        style="width: 250px; height: 40px; border: 1px solid #c1c1c1; margin: 10px 25px; padding: 0px; resize: none;  display: none; ">
  // //     </textarea>
  // reCapchaResponseField.setAttribute('id','g-recaptcha-response');
  // reCapchaResponseField.setAttribute('name','g-recaptcha-response');
  // reCapchaResponseField.setAttribute('class','g-recaptcha-response');
  // reCapchaResponseField.setAttribute('style','\
  //   width: 250px; \
  //   height: 40px; \
  //   border: 1px solid #c1c1c1; \
  //   margin: 10px 25px; \
  //   padding: 0px; \
  //   resize: none;  \
  //   display: none; \
  // ');
  
  // reCapchaElement.appendChild(reCapchaSecond);
  // reCapchaSecond.appendChild(reCapchaThird);
  // reCapchaThird.appendChild(reCapchaFour);
  // reCapchaSecond.appendChild(reCapchaResponseField);

  // append our completed captcha to the form
    this.form.appendChild(reCapchaElement);

  }


  toScreen() {
    return 0;
  }

}