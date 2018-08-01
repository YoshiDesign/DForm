import Editor from '../html/htmleditor';
export default class Widgeteer {

    public widget : HTMLElement;

    constructor(){}

    makeWidget(widget : string, currentStyle : Object, generalStyles : Object) {
    
        switch(widget){
        
            case "schoolWidget" :

                let bootstrapEncaps = document.createElement('DIV');
                let label  = document.createElement('LABEL');
                let input  = document.createElement('INPUT');
                bootstrapEncaps.setAttribute('class', 'form-group');
                label.setAttribute('style', Editor['LabelMargin']);

                var dynamicContainer        = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var positionFieldContainer  = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var schoolDistrictContainer = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var schoolNameContainer = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var outerContainer      = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var checkboxContainer   = <HTMLElement> bootstrapEncaps.cloneNode(false);
                var checkboxExpand      = <HTMLElement> input.cloneNode(false);
                var positionField       = <HTMLElement> input.cloneNode(false);
                var schoolNameField     = <HTMLElement> input.cloneNode(false);
                var schoolDistField     = <HTMLElement> input.cloneNode(false);
                var checkboxLabel   = <HTMLElement> label.cloneNode(false);
                var positionLabel   = <HTMLElement> label.cloneNode(false);
                var schoolNameLabel = <HTMLElement> label.cloneNode(false);
                var schoolDistLabel = <HTMLElement> label.cloneNode(false);

                dynamicContainer.setAttribute('id', 'schools');

                // Setup inputs for each widget element
                checkboxExpand.setAttribute('value', 'Homeschool');     // DB:: assign_to value
                checkboxExpand.setAttribute('name', 'assign_to');
                checkboxExpand.setAttribute('id', 'assign_to');
                checkboxExpand.setAttribute('style', currentStyle["CheckBoxes"]);
                checkboxExpand.setAttribute('type', 'checkbox');

                positionField.setAttribute('class', 'input-xxlarge');
                positionField.setAttribute('id', 'position');
                positionField.setAttribute('style', currentStyle["widgets"]["WidgetMajor"]);
                positionField.setAttribute('name', 'position');
                positionField.setAttribute('type', 'text');
                positionField.setAttribute('position-from-widget', '');


                schoolNameField.setAttribute('class', 'input-xxlarge');
                schoolNameField.setAttribute('id', 'school_name');
                schoolNameField.setAttribute('style', currentStyle["widgets"]["WidgetMajor"]);
                schoolNameField.setAttribute('name', 'school_name');
                schoolNameField.setAttribute('type', 'text');
                
                schoolDistField.setAttribute('class', 'input-xxlarge');
                schoolDistField.setAttribute('id', 'school_district');
                schoolDistField.setAttribute('style', currentStyle["widgets"]["WidgetMajor"]);
                schoolDistField.setAttribute('name', 'school_district');
                schoolDistField.setAttribute('type', 'text');

                // Setup widget labels
                positionLabel.innerText   = "Position";
                positionLabel.setAttribute("style", generalStyles['FullWidth']);
                schoolNameLabel.innerText = "School Name";
                schoolDistLabel.innerText = "School District";
                checkboxLabel.innerText   = "I’m interested in Math-U-See for schools.";

                // Setup Structure
                checkboxContainer.appendChild(checkboxExpand);
                checkboxContainer.appendChild(checkboxLabel);

                positionFieldContainer.appendChild(positionLabel);
                positionFieldContainer.appendChild(positionField);

                schoolNameContainer.appendChild(schoolNameLabel);
                schoolNameContainer.appendChild(schoolNameField);

                schoolDistrictContainer.appendChild(schoolDistLabel);
                schoolDistrictContainer.appendChild(schoolDistField);

                // Final form
                outerContainer.appendChild(checkboxContainer);
                outerContainer.appendChild(dynamicContainer);
                dynamicContainer.appendChild(positionFieldContainer);
                dynamicContainer.appendChild(schoolDistrictContainer);
                dynamicContainer.appendChild(schoolNameContainer);
        
                outerContainer.setAttribute('data-dynaform', '');
                outerContainer.setAttribute('data-widget-target', '');
                outerContainer.setAttribute('id', 'school-widget');

                return outerContainer;

        
        }

    }

}
