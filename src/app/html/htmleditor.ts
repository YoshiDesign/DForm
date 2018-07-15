export default class HTMLeditors {
    /**
    *   Relationships between our selected form and its available options / subsets
    */
    constructor(){}

    public editorNodes = (idBy) => {
        switch (idBy) {
            // These ID's should become classes upon extension
            case "nameField":
                let x = document.createElement("INPUT");
                x.setAttribute("id", "nglabeling");
                x.setAttribute("type", "text");
                x.setAttribute("placeholder", "Edit Label");
                console.log("XXXXX" + x.id);
                return x;
                // return String(`{
                //     "nameField" : 
                //         "<input id='nglabeling' type='text' placeholder='Edit Label' >"
                        
                // }`);
                // break;
            // case "passwdField":
            //     return null;
            //     // break;
            // case "emailField":
            //     return String(`{
            //         "emailField" : 
            //             "<input id='nglabeling' type='text' value='' placeholder='Edit Label'>"
            //     }`);
            //     // break;
            // case "checkboxField":
            //     return String(`{
            //         "checkboxField" : 
            //             "<input id='nglabeling' type='text' value='' id='checkboxEdit' placeholder='Edit Label'>"
            //     }`);

            default:
                return null;
        }

    }

    public selectOptions = {
        // Locale Select box by state
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

    public styles = {
        "major" : `
            width:90%;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #fff;
            height: 40px;
            background-color: rgba(255, 255, 255, .1);
            color: #fff;
            padding: 0 0 0 5px;
            font-size: 25px;`,
        
    }
}
