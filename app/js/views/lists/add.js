define(['models/tasklist', 'views/lists/edit'], function(TaskList, EditListView) {

    var AddListView = EditListView.extend({

        submit: function() {
            var self = this,
                title = this.$el.find('input[name="title"]').val();

            this.model.save({ title: title }, { success: function(response) {
                bTask.collections.lists.add(response);
                self.remove();
            }});

            return false;
        }

    });

    return AddListView;

});