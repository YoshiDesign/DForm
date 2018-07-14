export default function HTMLeditors(type) : JSON {

    let editView = JSON.parse(`{
        'nameField' : 
                <input type='text' placeholder='' (keyup)='changeTest($event)'>
            ,
        'passwdField : 
                <input type='password' placeholder='' (keyup)='changeTest($event)'>
            ,
        'emailField' :
                <input type="email" placeholder='' (keyup)='changeTest($event)
    }`);

    return editView;
}
