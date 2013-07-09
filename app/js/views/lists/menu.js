define(['views/lists/menuitem'], function(ListMenuItemView) {
    var ListMenuView = Backbone.View.extend({
        el: '#list-menu',
        className: 'nav nav-list lists-nav',

        events: {},

        initialize: function() {
            this.collection.on('add', this.renderMenuItem, this);
        },

        renderMenuItem: function(model, collection, options) {
            var item = new ListMenuItemView({ model: model });
            this.$el.append(item.render().el);

            if (!bTask.views.activeListMenuItem) {
                bTask.views.activeListMenuItem = item;
            }

            if (model.get('id') === bTask.views.activeListMenuItem.model.get('id')) {
                item.open();
            }
        },

        removeMenuItem: function(model, collection, options) {
            var id = model.get('id');
            var item = $('li').attr(id);
            console.log(item);
        },

        render: function() {
            var $el = $(this.el),
                self = this;
            this.collection.each(function(list) {
                self.renderMenuItem(list);
            });
            return this;

        }
    });
    return ListMenuView;
});