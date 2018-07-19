export default class HTMLeditors {
    /**
    *   Relationships between our selected form and its available options / subsets
    */
    public container  : HTMLElement;
    public labelInput : HTMLElement;
    public isRequired : HTMLElement;
    public anyLabel   : HTMLElement;

    constructor(){
       this.resetEditor();
    }

    public editorNodes = (idBy) => {
        /**
         * Constructs a separate editor for each type of form field
         * Each editor's input's ID attribute should correspond to what it is effectively doing
         */
        
        switch (idBy) {
            
            case "subButtonField":
                this.resetEditor();
    
                this.container.setAttribute("id", "ngsubmit-button-editor");
                this.labelInput.setAttribute("id", "nglabeling");
                this.labelInput.setAttribute("type", "text");
                this.labelInput.setAttribute("placeholder", "Edit Label");

                this.container.appendChild(this.labelInput);

                return this.container;

            case "noField" || null:
                return null;

            case "recaptchaField":
                return null;

            case "heading":
                this.resetEditor();
    
                this.container.setAttribute("id", "ngsubmit-els-editor");
                this.labelInput.setAttribute("id", "nglabeling");
                this.labelInput.setAttribute("type", "text");
                this.labelInput.setAttribute("placeholder", "Edit Label");

                this.container.appendChild(this.labelInput);

                return this.container;

            default:
                this.resetEditor();
                if (idBy == "nameField" 
                || "telField" 
                || "checkboxField" 
                || "emailField" 
                || "dateField" 
                || "selectField")
                    this.isRequired.setAttribute("checked", "");

                this.container.setAttribute("id", "ngsubmit-els-editor");

                this.labelInput.setAttribute("id", "nglabeling");
                this.labelInput.setAttribute("type", "text");
                this.labelInput.setAttribute("placeholder", "Edit Label");

                this.anyLabel.setAttribute("id", "anylabel");
                this.anyLabel.textContent = "Required";

                this.container.appendChild(this.labelInput);
                this.container.appendChild(this.isRequired);
                this.container.appendChild(this.anyLabel);
                
                return this.container;
        }

    }

    public selectOptions = {
        // State Selections
        "None":"Select State",
        'INTL':"International Customer",
        'AL':"Alabama",
        'AK':"Alaska",
        'AZ':"Arizona",
        'AR':"Arkansas",
        'CA':"California",
        'CO':"Colorado",
        'CT':"Connecticut",
        'DE':"Delaware",
        'DC':"District Of Columbia",
        'FL':"Florida",
        'GA':"Georgia",
        'HI':"Hawaii",
        'ID':"Idaho",
        'IL':"Illinois",
        'IN':"Indiana",
        'IA':"Iowa",
        'KS':"Kansas",
        'KY':"Kentucky",
        'LA':"Louisiana",
        'ME':"Maine",
        'MD':"Maryland",
        'MA':"Massachusetts",
        'MI':"Michigan",
        'MN':"Minnesota",
        'MS':"Mississippi",
        'MO':"Missouri",
        'MT':"Montana",
        'NE':"Nebraska",
        'NV':"Nevada",
        'NH':"New Hampshire",
        'NJ':"New Jersey",
        'NM':"New Mexico",
        'NY':"New York",
        'NC':"North Carolina",
        'ND':"North Dakota",
        'OH':"Ohio",
        'OK':"Oklahoma",
        'OR':"Oregon",
        'PA':"Pennsylvania",
        'RI':"Rhode Island",
        'SC':"South Carolina",
        'SD':"South Dakota",
        'TN':"Tennessee",
        'TX':"Texas",
        'UT':"Utah",
        'VT':"Vermont",
        'VA':"Virginia",
        'WA':"Washington",
        'WV':"West Virginia",
        'WI':"Wisconsin",
        'WY':"Wyoming"
    }
    /**
     *  "title" : Also corresponds to html style selection button id's
     */
    public MUS = {
        // Math-U-See styles
        "title" : "MUS",

        "container" : `
            background-color:#343e79;
            max-width:1120px;
            padding:15px 40px;color:#fff;
        `,

        "MajorInput" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 2px solid #fff;
            height: 40px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;
            font-size: 25px;`,

        "TextAreaStyle" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 2px solid #fff;
            height:100px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;padding: 0 0 0 5px;
            font-size: 15px;
        `,

        "Opposite" : `
            border-bottom: 1px solid #0054a5;
        `,

        "ButtonStyleDefinition" : `
            height:45px;
            border-radius:0;
            border:none;
            font-size:20px;
            margin-top:15px;
        `,

        "CheckBoxes" : `
            margin-right:10px;
            color: #fff;
        `,

        "Radio" : `
            margin-right:10px;
            color: black;

        `,

        "SelectBoxStyle" : `
            border-radius: 0;
            border: none;
            height: 40px;
            width:199px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;font-size: 15px;
        `,

        "SubmitButtonStyles" : `
            font-variant: small-caps;
            height:45px;
            border-radius:0;
            border:none;
            font-size:20px;
            margin-top:15px;
            width:199px;
            -webkit-appearance: button;

        `,
        "RangeStyle" : `
            width: 200px;
            margin: 8px;
        `,
        
        "widgets" : {

            "WidgetMajor" : `
                width:90%;
                border-radius: 0;
                border: none;
                border-bottom: 2px solid #fff;
                height: 40px;
                background-color: rgba(255, 255, 255, .1);
                color: #fff;
                padding: 0 0 0 5px;
                font-size: 25px;`,

                "WidgetMajorMid" : `
                    width: 83%;
                
            `,
        }
        
    }

    public SYS = {

        "title" : "SYS",

        "container" : `
            background-color:#fff;
            max-width:1120px;
            padding:15px 40px;color:#333;
        `,

        "MajorInput" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 2px solid #0054a5;
            height: 40px;
            background-color: #f7f7f7;
            color: #333;
            padding: 0 0 0 5px;
            font-size: 25px;`,

        "TextAreaStyle" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 2px solid #0054a5
            height:100px;
            background-color: #f7f7f7;
            color: #333;
            padding: 0 0 0 5px;font-size: 15px;
        `,
        "Opposite" : `
            border-bottom: 2px solid #fff;
        `,
        "ButtonStyleDefinition" : `
            background-color: #F05F40;
            border-color: #F05F40;
        `,

        "LabelStyle" : `
            margin-right:10px;
        `,

        "CheckBoxes" : `

            margin-right:10px;
            color: black;

        `,

        "Radio" : `

            margin-right:10px;
            color: black;

        `,

        "SelectBoxStyle" : `
            border-radius: 0;
            border: none;
            height: 40px;
            width:199px;
            background-color: #f7f7f7;
            color: #333;
            padding: 0 0 0 5px;
            font-size: 15px;
        `,

        "SubmitButtonStyles" : `
            
            font-variant: small-caps;
            height:45px;
            border-radius:0;
            border:none;
            font-size:20px;
            margin-top:15px;
            width:80%;
            text-align:center;
            background-color: #F05F40;
            border-color: #F05F40;
            opacity:0.65;
            transition: all 0.9s;
            -webkit-appearance: button;
            border-radius:300px;
        `,

        "RangeStyle" : `
            width: 200px;
            margin: 8px;
        `,

        "widgets" : {
            
            "WidgetMajor" : `
                width:90%;
                border-radius: 0;
                border: none;
                border-bottom: 2px solid #0054a5;
                height: 40px;
                background-color: #f7f7f7;
                color: #fff;
                padding: 0 0 0 5px;
                font-size: 25px;`,

            "WidgetMajorMid" : `
                width: 83%;
            `,
        }

    }

    public General = {
        "LabelMargin" : `
            margin-right:8px;
        `,
        "ColorWheel" : `
            width: 35px;
        `,
        "FullWidth" : `
            width:100%;
        `,
        "DefaultFieldStyle" : `
            -webkit-appearance: textfield;
            background-color: white;
            -webkit-rtl-ordering: logical;
            cursor: text;
            padding: 1px;
            border-width: 2px;
            border-style: inset;
            border-color: initial;
            border-image: initial;
        `,
        "noDisplay" : `
            display: none;
        `,
    }

    resetEditor () {
         // Toolbox
         this.container  = document.createElement('DIV');
         this.labelInput = document.createElement('INPUT');
         this.anyLabel   = document.createElement('LABEL');
 
         // Checkbox for assigning requirement status
         this.isRequired = document.createElement('INPUT');
         this.isRequired.setAttribute('type', 'checkbox');
         this.isRequired.setAttribute("id", "ngrequirement");
    }

}
