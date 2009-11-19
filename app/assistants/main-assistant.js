function MainAssistant() {
	this.page = 1;
}

MainAssistant.prototype.setup = function() {
	this.controller.stageController.pushScene("splash");
	
	this.count = 0;
	//this.page = 1;
	this.comicsListModel = {};
	this.controller.setupWidget("comicsList",
        {
            itemTemplate: "main/ItemTemplate"
        },
        this.comicsListModel);
        
    var    buttonPrev = {};
    var    buttonNext = {}; 

        buttonPrev = { icon: "back", command: "cmd-1"};
        buttonNext = { icon: "forward", command: "cmd-2"};
        
        this.attributes = {
           spacerHeight: 0,
           menuClass: 'no-fade'
        };
        this.models = {
          visible: true,
          items: [ 
                 buttonPrev,
                 buttonNext
            ]
    };
    
		this.spinnerLAttrs = {
			spinnerSize: 'large'
		}
    
		this.spinnerModel = {
			spinning: false
		}
		
		
    this.appMenuModel = {
  items: [
    {label: "About App", command: 'Aboutapp'}
  ]
};

    this.controller.setupWidget(Mojo.Menu.appMenu, {}, this.appMenuModel);

    this.controller.setupWidget('large-activity-spinner', this.spinnerLAttrs, this.spinnerModel);
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, 
	                                   		this.models);


        this.textCookie = new Mojo.Model.Cookie("textCookie");
        this.imgCookie = new Mojo.Model.Cookie("imgCookie");
        this.idcomics = new Mojo.Model.Cookie("idcomics");
        
    this.listTapHandler = this.listTapHandler.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('comicsList'),Mojo.Event.listTap, this.listTapHandler);
	this.getRemoteData(this.page);
}

MainAssistant.prototype.ready = function() {
}

MainAssistant.prototype.listTapHandler = function(event){
        var index = event.model.items.indexOf(event.item);
		if (index > -1) {
		this.imagelink = "http://imgs.xkcd.com/comics/" + event.item.imgfile;
	    this.textCookie.put(event.item.alttext);
	    this.imgCookie.put(this.imagelink);
	    this.idcomics.put(event.item.id);
		this.controller.stageController.pushScene("second", 1);
        }      
}


MainAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.command) {
		switch(event.command)
		{
			case 'cmd-1':
			    if(this.page == 1){
			    	Mojo.Controller.errorDialog("This is 1st page.");
			    	}
			    else{
			        this.page--;
				    this.getRemoteData(this.page);
			    	}
			break;
			case 'cmd-2':
			    this.page++;
				//$('message').update(this.page)
				this.getRemoteData(this.page);
			break;
			case 'opensite':
			     		this.controller.serviceRequest('luna://com.palm.applicationManager', {
				 		method: 'open',
				 		parameters: {
							target: "http://openidev.ru"
						}});
			break;

			case 'Aboutapp':
	this.controller.showAlertDialog({
		
	onChoose: function(value) {if(value == "opensite") {
		                          this.sitelink = "http://openidev.ru";
	                           }
		                       if(value == "xkcd"){
		                          this.sitelink = "http://xkcd.com";
	                           }
		                       
		 this.controller.serviceRequest('luna://com.palm.applicationManager', {
				 		method: 'open',
				 		parameters: {
							target: this.sitelink
						}}); 
	                    
						},
    title: $L("Info"),
    message: $L("Xkcd viewer 1.0 \t openidev.ru Alez: sash13@bigmir.net"),
    choices:[ 
         {label:$L("Visit xkcd.com"), value:"xkcd" },
         {label:$L("Visit my site"), value:"opensite" },  
         {label:$L("cancel"), value:"cancel", type:'dismiss'}  
    ]
    });
		
			break;
			default:
				//Mojo.Controller.errorDialog("Got command " + event.command);
			break;
		}
	}
}

MainAssistant.prototype.getRemoteData = function(pagen) {	

			this.spinnerModel.spinning = true;
			this.controller.modelChanged(this.spinnerModel);
    var url = 'http://openidev.ru/xkcd/xkcd.php';
    try 
    {
        if(!pagen) 
        {
            throw('Error');
        }
        var request = new Ajax.Request(url,
        	{
            	method: 'post',
            	parameters: {'pagen': pagen},
            	
            	evalJSON: 'true',
            	onSuccess: this.getRemoteDataSuccess.bind(this),
            	onFailure: function()
            	{
            		Mojo.Controller.errorDialog("Wait!You have some problem with internet connection!");
                	Mojo.Log.error('Failed to get Ajax response');
            this.spinnerModel.spinning = false;
			this.controller.modelChanged(this.spinnerModel);
            	}
        	});
    }
    catch(e)
    {
    	Mojo.Controller.errorDialog("Wait!You have some problem with internet connection!");
        Mojo.log.error(e);
        	this.spinnerModel.spinning = false;
			this.controller.modelChanged(this.spinnerModel);
    }
}

MainAssistant.prototype.getRemoteDataSuccess = function(response) {
			this.spinnerModel.spinning = false;
			this.controller.modelChanged(this.spinnerModel);
 
 	try
 	{
 		this.comicsListModel.items = response.responseText.evalJSON();
    	this.controller.modelChanged(this.comicsListModel);
 	}
 	catch(e)
 	{
 		this.page--;
 		Mojo.Controller.errorDialog("Wait!You have some problem with internet connection!");
 		Mojo.log.error(e);
 	}
}
