define(['gapi', 'views/app'], function(ApiManager, AppView) {
	var App = function() {
		this.views.app = new AppView();
		this.views.app.initialize(this);
		this.views.app.render();

		this.connectGapi();
	};

	App.prototype = {
		views: {},
		connectGapi: function() {
			this.apiManager = new ApiManager(this);
		}
	};

	return App;
});