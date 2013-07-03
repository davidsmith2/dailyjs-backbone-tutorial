define(['lib/text!templates/app.html'], function(template) {
	var app;

	var AppView = Backbone.View.extend({
		id: 'main',
		tagName: 'div',
		className: 'container-fluid',
		el: 'body',
		template: _.template(template),
		logInContainer: '#sign-in-container',
		logOutContainer: '#sign-out-container',

		events: {
			'click #sign-in-button': 'signIn',
			'click #sign-out-button': 'signOut'
		},

		initialize: function(app) {
			this.app = app;
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		},

		signIn: function() {
			this.app.apiManager.signIn();
			return false;
		},

		signOut: function(event) {
			this.app.apiManager.signOut();
			return false;
		},

		toggleAuthState: function(elementToHide, elementToShow) {
			$(elementToHide).hide();
			$(elementToShow).show();
		}
	});

	return AppView;
});