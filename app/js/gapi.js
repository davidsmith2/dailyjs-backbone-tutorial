define(['config'], function(config) {

	// on instantiation, save a reference to the global app variable and
	// attemtp to load the Google client
	function ApiManager(_app) {
		this.app = _app;
		this.loadGapi();
	}

	// extend the ApiManager class to include Backbone's 
	// Events properties and methods
	_.extend(ApiManager.prototype, Backbone.Events);

	// asynchronously load the Google client
	ApiManager.prototype.loadGapi = function() {
		var self = this;

		// if the client has already been loaded, 
		// proceed to initialize ApiManager
		if (typeof gapi !== 'undefined') {
			return this.init();
		}

		require(['https://apis.google.com/js/client.js?onload=define'], function() {
			// recursively check whether the Google client has been 
			// loaded until it has been loaded
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

		// load the Google Tasks API
		gapi.client.load('tasks', 'v1', function() {});

		handleClientLoad();

		// give the Google client your API key and 
		// check your credentials
		function handleClientLoad() {
			gapi.client.setApiKey(config.api_key);
			window.setTimeout(checkAuth, 100);
		}

		// check your credentials with Google
		function checkAuth() {
			var credentials = {
				client_id: config.client_id,
				scope: config.scopes,
				immediate: true
			}
			gapi.auth.authorize(credentials, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			var authTimeout;

			// if there's a response from Google and there *isn't* an error...
			if (authResult && !authResult.error) {
				if (authResult.expires_in) {
					authTimeout = (authResult.expires_in - 5 * 60) * 1000;
					setTimeout(checkAuth, authTimeout);
				}
				// hide the sign-in button...
				self.app.views.auth.$el.hide();
				// .. and reveal the area for restricted content
				$('#signed-in-container').show();
				// the app is now ready to begin requesting personal data
				self.trigger('ready');
			// if there's a response from Google and there *is* an error
			} else {
				if (authResult && authResult.error) {
					console.error('Unable to sign in:', authResult.error);
				}
				// show the sign-in button
				self.app.views.auth.$el.show();
			}
		}

		// public method -- this is what happens when the sign-in button is clicked
		this.checkAuth = function() {
			var credentials = {
				client_id: config.client_id, 
				scope: config.scopes, 
				 // displays the Google pop-up if the user isn't signed in
 				immediate: false
			};
			gapi.auth.authorize(credentials, handleAuthResult);
		};

	};

	// map third-party API methods to Backbone methods for 
	// create, read, update and delete
	Backbone.sync = function(method, model, options) {

		// fetch = read
		// save = create and update

		var request, requestContent = {};

		options || (options = {});

		// model url will either be "tasks" or "tasklists"
		if (model.url === 'tasks') {
			requestContent['task'] = model.get('id');
		} else {
			requestContent['tasklist'] = model.get('id');
		}

		switch (method) {
			case 'create':
				// packet
				requestContent['resource'] = model.toJSON();
				// request
				request = gapi.client.tasks[model.url].insert(requestContent);
				// send request
				Backbone.gapiRequest(request, method, model, options);
			break;

			case 'read':
				// request
				request = gapi.client.tasks[model.url].list(options.data);
				// send request
				Backbone.gapiRequest(request, method, model, options);
			break;

			case 'update':
				// packet
				requestContent['resource'] = model.toJSON();
				// request
				request = gapi.client.tasks[model.url].update(requestContent);
				// send request
				Backbone.gapiRequest(request, method, model, options);
			break;

			case 'delete':
				requestContent['resource'] = model.toJSON();
				request = gapi.client.tasks[model.url].delete(requestContent);
				Backbone.gapiRequest(request, method, model, options);
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