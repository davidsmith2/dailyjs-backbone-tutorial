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
				view.toggleAuthState(view.logInContainer, view.logOutContainer);
			} else {
				// not signed in
				if (authResult && authResult.error) {
					console.error('Unable to sign in:', authResult.error);
				}
				view.toggleAuthState(view.logOutContainer, view.logInContainer);
			}
		}

		this.logIn = function() {
			var credentials = {
				client_id: config.clientId,
				scope: config.scopes,
				immediate: false // popup if not signed in
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		};

		this.logOut = function() {
			var view, sessionParams;
			view = app.views.app;
			sessionParams = {
				client_id: config.clientId,
				state: gapi.auth.getToken().state
			};

			gapi.auth.checkSessionState(sessionParams, function(sessionState) {
				if (sessionState) {
					console.log("You have successfully logged out");
					view.toggleAuthState(view.logOutContainer, view.logInContainer);
				} else {
					console.log("You must sign out of Google first");
				}
			});
		};

		handleClientLoad();

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