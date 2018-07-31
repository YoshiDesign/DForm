export class ResourceManager {
    
    public resourceMonitorOpen : Boolean;
    public resourceListrakCheck : Boolean;

    constructor(){
        this.resourceListrakCheck = false;
        this.resourceMonitorOpen  = false;
    }

    openResource(e : Event, type : string, IdBy : string) : void {

        this.resourceMonitorOpen = true;
    
      }
    activateListrak (e) {
        /**
         * Acquire disabled nodes under Listrak Resource
         */
        let lisTracking = document.getElementById("listracking");
        let listrakSource = document.getElementById("listrak-source-resource");
        let listrakExternalId = document.getElementById("listrak-externalid-resource");
    
          for (let i = 0; i < lisTracking.children.length; i++)
          {
            if (e.target.checked) {
              lisTracking.children[i].removeAttribute("disabled");
              listrakSource.setAttribute("value", "2403731");
              listrakExternalId.setAttribute("value", "13064");
            }
            else {
              if (lisTracking.children[i].hasAttribute("type")) {
                lisTracking.children[i].setAttribute("disabled", "");
                lisTracking.children[i].setAttribute("value", "");
              }
            }
          }
      }


    
}
