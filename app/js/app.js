define(['gapi', 'views/app', 'collections/tasklists'], function(ApiManager, AppView, TaskLists) {
	var App = function() {
		this.views.app = new AppView();
		this.views.app.initialize(this);
		this.views.app.render();

		this.collections.lists = new TaskLists();

		this.connectGapi();
	};

	App.prototype = {
		views: {},
		collections: {},
		connectGapi: function() {
			var self = this;
			this.apiManager = new ApiManager(this);
			this.apiManager.on('ready', function() {
				self.collections.lists.fetch({
					data: {
						userId: '@me'
					},
					success: function(response) {
						_.each(response.models, function(model) {
							console.log(model.get('title'));
						});
					}
				});
			});
		}
	};

	return App;
});