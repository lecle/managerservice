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

    describe('#monitor()', function() {
        it('should monitor without error', function(done) {

            // manager service load
            var dummyContainer = {
                addListener : function(){},
                broadcast : function(command, req, callback){ callback(null, {data:[{data:'test'}]})},
                log : function(log) { console.log(log)},
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

                manager.monitor();
                done();
            });
        });
    });

});