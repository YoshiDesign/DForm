export default function HTMLeditors(idBy : string) : string {
    /**
    *   Future Optimization - Each JSON key is currently free parking; arbitrary
    */
    switch (idBy) {
        case "nameField":
            return String(`{
                "nameField" : 
                    "<label></label><input id='labeling' type='text' placeholder='Edit Label'><hr>"
            }`);
            // break;
        case "passwdField":
            return null;
            // break;
        case "emailField":
            return String(`{
                "emailField" : 
                    "<label></label><input id='labeling' type='text' value='' placeholder='Edit Label'>"
            }`);
            // break;
        case "checkboxField":
            return String(`{
                "checkboxField" : 
                    "<label></label><input id='labeling' type='text' value='' id='checkboxEdit' placeholder='Edit Label'><hr>"
            }`);

        default:
            return null;
    }

}
