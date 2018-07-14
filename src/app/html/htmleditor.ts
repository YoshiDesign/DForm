export default function HTMLeditors(idBy : string) : string {
    /**
    *   Future Optimization - Each JSON key is currently free parking; arbitrary
    */
    switch (idBy) {
        case "nameField":
            return String(`{
                "nameField" : 
                    "<input type='text' placeholder='' (keyup)='changeLabel($event)'>"
            }`);
            // break;
        case "passwdField":
            return null;
            // break;
        case "emailField":
            return String(`{
                "emailField" : 
                    "<input type='email' placeholder='' (keyup)='changeLabel($event)'>"
            }`);
            // break;
        case "checkboxField":
            return null;
  
  
        default:
            break;
    }

}
