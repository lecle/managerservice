var manager = require('../lib/manager');

describe('manager', function() {
    describe('#init()', function() {
        it('should initialize without error', function(done) {

            // manager service load
            var dummyContainer = {addListener:function(){}};

            manager.init(dummyContainer, function(err) {

                manager.close(done);
            });
        });
    });

});