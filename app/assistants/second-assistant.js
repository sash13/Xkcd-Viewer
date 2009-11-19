function SecondAssistant() {
}

SecondAssistant.prototype.setup = function() {

	
	var    buttonPrev = {};
    var    buttonNext = {}; 

        buttonPrev = { label: "Exit", command: "cancel"};
        buttonNext = { icon: "info", submenu: "category-menu"};
        
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
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, this.attributes, 
	                                   		this.models);
	                                   		
	
		this.categoryMenuModel = { label: $L('Category'), items: [ 
									                {label: $L('Info comics'), command:'info' }, 
									                {label: $L('On xkcd.com'), command:'link'}, 
									                {label: $L('Email link'), command:'email'},
									                {label: $L('Message link'), command:'message'}
								]};
	
	this.controller.setupWidget('category-menu', undefined, this.categoryMenuModel);
	
		this.myheight = Mojo.Environment.DeviceInfo.screenHeight;
		this.mywidth = Mojo.Environment.DeviceInfo.screenWidth;
		this.idcomics = new Mojo.Model.Cookie("idcomics")
		this.link = "http://xkcd.com/" + this.idcomics.get();
 
     this.imageViewModel = {
     	background: "black"
     	};
     this.controller.setupWidget('ImageId', 
            this.attributes = {
            noExtractFS: true,
            extractfsParams:"720:720:3",
            limitZoom: true,
            highResolutionTimeout: 0.3
            }, this.imageViewModel);
     this.controller.get('ImageId').observe(Mojo.Event.imageViewChanged, this.changedImage.bind(this));
     
     		this.spinnerLAttrs = {
			spinnerSize: 'large'
		}
    
		this.spinnerModel = {
			spinning: false
		}
		
    this.controller.setupWidget('large-activity-spinner', this.spinnerLAttrs, this.spinnerModel);
}

SecondAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.command) {
		switch(event.command)
		{
			case 'info':
			       this.textCookie = new Mojo.Model.Cookie("textCookie");
	this.controller.showAlertDialog({
    title: $L("Info"),
    message: $L(this.textCookie.get()),
    choices:[ 
         {label:$L("cancel"), value:"cancel", type:'dismiss'}    
    ]
    });
			break;
			case 'cancel':
			     this.controller.stageController.popScene();

			break;
			
			case 'message':
			     		this.controller.serviceRequest('luna://com.palm.applicationManager', {	
						method: 'open',
						parameters: {
							id: 'com.palm.app.messaging',
							params: {messageText: "Look this: " +this.link}
						}})

			break;
			
			case 'email':
			     		this.controller.serviceRequest('luna://com.palm.applicationManager', {
				 		method: 'open',
				 		parameters: {
							id: 'com.palm.app.email',
							params: {text: "Look this: " +this.link}
						}});

			break;
			
						case 'link':
			     		this.controller.serviceRequest('luna://com.palm.applicationManager', {
				 		method: 'open',
				 		parameters: {
							target: this.link
						}});

			break;
			
			default:
			break;
		}
	}
}


SecondAssistant.prototype.activate = function(event) {
	this.controller.enableFullScreenMode(true);
	this.imgCookie = new Mojo.Model.Cookie("imgCookie");
	this.controller.get('ImageId').mojo.manualSize(this.mywidth,this.myheight);
	this.controller.get('ImageId').mojo.centerUrlProvided(this.imgCookie.get());


			this.spinnerModel.spinning = true;
			this.controller.modelChanged(this.spinnerModel);

}


SecondAssistant.prototype.deactivate = function(event) {
	this.controller.enableFullScreenMode(false);
}

SecondAssistant.prototype.changedImage = function(event) {
 if (event.error) { this.spinnerModel.spinning = false;
			this.controller.modelChanged(this.spinnerModel); Mojo.Log.error("Failed to load image!"); Mojo.Controller.errorDialog("Wait!You have any problem with internet connection!"); return; }
     Mojo.Log.info("Loaded the image okay!", event.url);
     			this.spinnerModel.spinning = false;
			this.controller.modelChanged(this.spinnerModel);
}

SecondAssistant.prototype.cleanup = function(event) {
}
