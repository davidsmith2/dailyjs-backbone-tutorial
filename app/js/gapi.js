define(['config'], function(config) {
	var app;

	function ApiManager(_app) {
		app = _app;
		this.loadGapi();
	}

	_.extend(ApiManager.prototype, Backbone.Events);

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
				immediate: true // no popup if signed in
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			var authTimeout, view = app.views.app;

			if (authResult && !authResult.error) {
				// signed in
				if (authResult.expires_in) {
					authTimeout = (authResult.expires_in - 5 * 60) * 1000;
					setTimeout(checkAuth, authTimeout);
				}
				view.toggleAuthState(view.signInContainer, view.signOutContainer);
				self.trigger('ready');
			} else {
				// not signed in
				if (authResult && authResult.error) {
					console.error('Unable to sign in:', authResult.error);
				}
				view.toggleAuthState(view.signOutContainer, view.signInContainer);
			}
		}

		this.signIn = function() {
			var credentials = {
				client_id: config.clientId,
				scope: config.scopes,
				immediate: false // popup if not signed in
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		};

		this.signOut = function() {
			var view, sessionParams;
			view = app.views.app;
			sessionParams = {
				client_id: config.clientId,
				state: gapi.auth.getToken().state
			};

			gapi.auth.checkSessionState(sessionParams, function(okToSignOut) {
				if (!okToSignOut) {
					console.log("You must sign out of Google first");
				} else {
					console.log("You have successfully signed out");
					view.toggleAuthState(view.signOutContainer, view.signInContainer);
				}
			});
		};

		handleClientLoad();

	};

	Backbone.sync = function(method, model, options) {

		var request, requestContent = {};

		options || (options = {});

		switch (method) {
			case 'create':
				requestContent['resource'] = model.toJSON();
				request = gapi.client.tasks[model.url].insert(requestContent);
				Backbone.gapiRequest(request, method, model, options);
			break;

			case 'read':
				request = gapi.client.tasks[model.url].list(options.data);
				Backbone.gapiRequest(request, method, model, options);
			break;

			case 'update':
			break;

			case 'delete':
			break;
		}
	};

	Backbone.gapiRequest = function(request, method, model, options) {
		var result;
		request.execute(function(response) {
			if (response.error) {
				if (options.error) options.error(response);
			} else if (options.success) {
				if (response.items) {
					result = response.items;
				} else {
					result = response;
				}
				options.success(result, true, request);
			}
		});
	};

	return ApiManager;
});