define(['lib/text!templates/lists/menuitem.html'], function(template) {
    var ListMenuItemView = Backbone.View.extend({
        className: 'list-menu-item',
        tagName: 'li',
        template: _.template(template),

        events: {
            'click': 'open'
        },

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        render: function() {
            var $el = $(this.el);
            $el.data('listId', this.model.get('id'));
            $el.html(this.template(this.model.toJSON()));
            return this;
        },

        open: function() {
            var self = this;
            console.log(self);
            return false;
        },

        remove: function() {}

    });

    return ListMenuItemView;
});