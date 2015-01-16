var manager = require('../lib/manager');

describe('manager', function() {
    describe('#init()', function() {
        it('should initialize without error', function(done) {

            // manager service load
            var dummyContainer = {
                addListener : function(){},
                getRouteTable : function() {
                    return {
                        "MANAGER": {
                            "serviceName" : "MANAGER",
                            "moduleName" : "lecle/managerservice",
                            "status" : "off"
                        },
                        "HTTP": {
                            "serviceName" : "HTTP",
                            "moduleName" : "lecle/httpservice",
                            "status" : "off"
                        }
                    }
                }
            };

            manager.init(dummyContainer, function(err) {

                manager.close(done);
            });
        });
    });

});