define([
		'gapi', 
		'views/app', 
		'views/auth', 
		'views/lists/menu',
		'collections/tasklists'
	], 

	function(ApiManager, AppView, AuthView, ListMenuView, TaskLists) {
		var App = function() {
			this.views.app = new AppView();
			this.views.app.render();
			this.views.auth = new AuthView(this);
			this.views.auth.render();
			this.collections.lists = new TaskLists();
			this.views.listMenu = new ListMenuView({ collection: this.collections.lists });
			this.connectGapi();
		};

		App.prototype = {
			collections: {},
			models: {},
			views: {},
			connectGapi: function() {
				var self = this;
				this.apiManager = new ApiManager(this);
				this.apiManager.on('ready', function() {
					self.collections.lists.fetch({
						silent: true,
						data: {
							userId: '@me'
						},
						success: function(response) {
							self.models.activeList = self.collections.lists.first();
							self.views.listMenu.render();
						}
					});
				});
			}
		};

		return App;
	}
);