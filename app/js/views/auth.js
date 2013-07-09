define(['lib/text!templates/auth.html'], function(template) {

    var AuthView = Backbone.View.extend({

        // element to which template should be appended
        el: '#sign-in-container',
        template: _.template(template),

        events: {
            'click #authorize-button': 'auth'
        },

        initialize: function(_app) {
            this.app = _app;
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        auth: function() {
            this.app.apiManager.checkAuth();
            return false;
        }

    });

    return AuthView;
    
});