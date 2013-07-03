define(['config'], function(config) {
	var app;

	function ApiManager(_app) {
		app = _app;
		this.loadGapi();
	}

	_.extend(ApiManager.prototype, Backbone.Events);

	ApiManager.prototype.init = function() {
		var self = this;

		gapi.client.load('tasks', 'v1', function() { /* Loaded */});

		function handleClientLoad() {
			gapi.client.setApiKey(config.apiKey);
			window.setTimeout(checkAuth, 100);
		}

		function checkAuth() {
			var credentials = {
				client_id: config.clientId,
				scope: config.scopes,
				immediate: true
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			var authTimeout;

			if (authResult && !authResult.error) {
				if (authResult.expires_in) {
					authTimeout = (authResult.expires_in - 5 * 60) * 1000;
					setTimeout(checkAuth, authTimeout);
				}
				app.views.auth.$el.hide();
				$('#signed-in-container').show();
			} else {
				if (authResult && authResult.error) {
					console.error('Unable to sign in:', authResult.error);
				}
				app.views.auth.$el.show();
			}

		}

		this.checkAuth = function() {
			var credentials = {
				client_id: config.clientId,
				scope: config.scopes,
				immediate: false
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		}

		handleClientLoad();

	};

	ApiManager.prototype.loadGapi = function() {
		var self = this;

		// Don't load gapi if it's already present
		if (typeof gapi !== 'undefined') {
			return this.init();
		}

		require(['https://apis.google.com/js/client.js?onload=define'], function() {
			// Poll until gapi is ready
			function checkGapi() {
				if (gapi && gapi.client) {
					self.init();
				} else {
					setTimeout(checkGapi, 100);
				}
			}

			checkGapi();
		});
	};
	
	Backbone.sync = function(method, model, options) {
		options || (options = {});

		switch (method) {
			case 'create':
			break;

			case 'read':
			break;

			case 'update':
			break;

			case 'delete':
			break;
		}
	};

	return ApiManager;
});