define(['lib/text!templates/app.html', 'views/lists/add'], function(template, AddListView) {
	var app;

	var AppView = Backbone.View.extend({
		id: 'main',
		tagName: 'div',
		className: 'container-fluid',
		el: 'body',
		template: _.template(template),
		signInContainer: '#sign-in-container',
		signOutContainer: '#sign-out-container',

		events: {
			'click #sign-in-button': 'signIn',
			'click #sign-out-button': 'signOut',
			'click #add-list-button': 'addList'
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
		},

		addList: function() {
			var list = new bTask.collections.lists.model({ title: ''}),
				form = new AddListView({ model: list }),
				self = this;

			this.$el.find('#list-editor').html(form.render().el);
			form.$el.find('input:first').focus();

			return false;
		}
	});

	return AppView;
});