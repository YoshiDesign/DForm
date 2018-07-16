export default class HTMLeditors {
    /**
    *   Relationships between our selected form and its available options / subsets
    */
    constructor(){}

    public editorNodes = (idBy) => {

        let x = document.createElement("INPUT");

        switch (idBy) {
            // These ID's should become classes upon extension
            case "toBeDecided":
                
                x.setAttribute("id", "nglabeling");
                x.setAttribute("type", "text");
                x.setAttribute("placeholder", "Edit Label");
                console.log("XXXXX" + x.id);
                return x;

            default:
                x = document.createElement("INPUT");
                x.setAttribute("id", "nglabeling");
                x.setAttribute("type", "text");
                x.setAttribute("placeholder", "Edit Label");
                console.log("XXXXX" + x.id + " " + idBy);
                return x;
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
     *  "title" : Corresponds to html style selection button id's
     */
    public MUS = {

        "title" : "MUS",

        "container" : `
            background-color:#343e79;
            max-width:1120px;
            padding:15px 40px;color:#fff;
        `,
        
        "MUSmajor" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #fff;
            height: 40px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;
            font-size: 25px;`,

        "musTextAreaHelp" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #fff;
            height:100px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;padding: 0 0 0 5px;
            font-size: 15px;
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
        `,
        
    }

    public SYS = {

        "title" : "SYS",

        "container" : `
            background-color:#343e79;
            max-width:1120px;
            padding:15px 40px;color:#fff;
        `,

        "MajorInput" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #fff;
            height: 40px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;
            font-size: 25px;`,

        "TextAreaHelp" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #fff;
            height:100px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;font-size: 15px;
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
        `,
        
    }

    public widgets = {


    }

}
