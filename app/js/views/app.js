define(['lib/text!templates/app.html'], function(template) {
	var app;

	var AppView = Backbone.View.extend({
		id: 'main',
		tagName: 'div',
		className: 'container-fluid',
		el: 'body',
		template: _.template(template),
		logInContainer: '#log-in-container',
		logOutContainer: '#log-out-container',

		events: {
			'click #log-in-button': 'logIn',
			'click #log-out-button': 'logOut'
		},

		initialize: function(app) {
			this.app = app;
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		},

		logIn: function() {
			this.app.apiManager.logIn();
			return false;
		},

		logOut: function() {
			this.app.apiManager.logOut();
			return false;
		},

		toggleAuthState: function(el2Hide, el2Show) {
			$(el2Hide).hide();
			$(el2Show).show();
		}
	});

	return AppView;
});