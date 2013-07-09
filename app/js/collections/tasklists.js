define(['models/tasklist'], function(TaskList) {
	var TaskLists = Backbone.Collection.extend({
		model: TaskList,
		url: 'tasklists',

        comparator: function(tasklist) {
            return tasklist.get('title');
        },

        initialize: function() {
            this.bind('add', this.onModelAdded, this);
        },

        onModelAdded: function(model, collection, options) {}

	});

	return TaskLists;
});