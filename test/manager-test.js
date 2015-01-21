var manager = require('../lib/manager');

var routeTable = {
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
};

var dummyContainer = {
    addListener : function(){},
    broadcast : function(command, req, callback){ callback(null, {data:[{data:'test'}]})},
    log : function(log) { console.log(log)},
    saveRouteTable : function(){},
    getRouteTable : function() {

        return {
            add : function() {}
        }
    },
    getRouteTableJSON : function() {
        return routeTable;
    }
};

describe('manager', function() {
    describe('#init()', function() {
        it('should initialize without error', function(done) {

            manager.init(dummyContainer, function(err) {

                manager.close(done);
            });
        });
    });

    describe('#monitor()', function() {
        it('should monitor without error', function(done) {

            manager.init(dummyContainer, function(err) {

                manager.monitor();
                done();
            });
        });
    });

});