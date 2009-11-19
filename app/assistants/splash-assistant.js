function SplashAssistant() {
}

SplashAssistant.prototype.setup = function() {
	$$('body')[0].addClassName('splash');
	this.splashTimer = setTimeout(this.removeSplashScreen.bind(this), 3000);

}

SplashAssistant.prototype.activate = function(event) {
}

SplashAssistant.prototype.removeSplashScreen = function() {
    this.controller.stageController.popScene();
    clearTimeout(this.splashTimer);
}


SplashAssistant.prototype.deactivate = function(event) {
	$$('body')[0].removeClassName('splash');
}

SplashAssistant.prototype.cleanup = function(event) {
}
