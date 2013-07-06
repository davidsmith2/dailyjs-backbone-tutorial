define(['views/lists/menuitem'], function(ListMenuItemView) {
    var ListMenuView = Backbone.View.extend({
        className: 'nav nav-list lists-nav',
        container: '.left-nav',
        tagName: 'ul',

        events: {},

        initialize: function() {
            this.collection.on('add', this.addListMenuItemView, this);
        },

        addListMenuItemView: function(list) {
            var listMenuItemView = new ListMenuItemView({ model: list });
            listMenuItemView.render();
        },

        render: function() {
            var $el = $(this.el),
                self = this,
                items;

            this.collection.each(function(list) {
                var item, sidebarItem;
                item = new ListMenuItemView({ model: list });
                $el.append(item.render().el).appendTo(self.container);
            });

            return this;
        }
    });

    return ListMenuView;
});