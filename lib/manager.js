"use strict";

exports.serviceName = 'MANAGER';
exports.moduleName = 'managerservice';
exports.container = null;

var monitoringInterval = null;

var processList = [];

// it is called at container
exports.init = function(container, callback) {

    exports.container = container;

    container.addListener('init', initService);
    container.addListener('extend', extendService);
    /*
     container.getRouteTableJSON()[this.serviceName].status = 'on';
     container.saveRouteTable();
     */
    var serviceList = container.getConfig('serviceList');

    if(serviceList)
        container.getRouteTable().setRouteTable(serviceList);

    var managerDirection = container.getConfig('managerDirection');

    if(!managerDirection)
        managerDirection = {"ip" : "127.0.0.1", "port" : 8080};

    exports.container.getRouteTable().add(exports.serviceName, exports.moduleName, managerDirection);
    exports.container.getRouteTable().setStatus(exports.serviceName, 'on');

    initProject();

    // Executing monitor
    if(process.env.NODE_ENV != 'test')
        monitoringInterval = setInterval(monitor, 100000);

    callback(null);
};

exports.close = function(callback) {

    if(monitoringInterval) {

        clearInterval(monitoringInterval);
    }

    for(var i= 0, cnt=processList.length; i<cnt; i++) {


        if(process.env.NODE_ENV === 'test') {

            processList[i].close(function(){});
        } else {

            processList[i].stop();
        }
    }

    processList = [];

    callback(null);
};

exports.monitor = monitor;

function initService(req, res) {

    var routeTable = exports.container.getRouteTableJSON();

    var ipAddress = req.connection.remoteAddress;

    // ipv6
    if(ipAddress.indexOf('::ffff:') === 0)
        ipAddress = ipAddress.substring(7);

    var responseData = {
        serviceName : '',
        moduleName : '',
        serviceInfo : {
            ip : ipAddress,
            port : makeNewPort(ipAddress)
        }
    };

    if(req.data.serviceName) {

        // Add the service at the route table
        //exports.container.getRouteTable().add(req.data.serviceName, req.data.moduleName, {ip : '', port : ''});
        responseData.serviceName = req.data.serviceName;
        responseData.moduleName = req.data.moduleName;

        if(routeTable[req.data.serviceName]) {

            // When the route table has record
            addDirection(responseData);
        } else {

            addRoute(responseData);
        }

    } else {

        // If there is no service name, an expected task is allocated.
        for(var name in routeTable) {

            if(routeTable[name].status === 'off' || routeTable[name].status === 'extending') {

                responseData.serviceName = name;
                responseData.moduleName = routeTable[name].moduleName;

                addDirection(responseData);
                break;
            }
        }
    }

    exports.container.getRouteTable().setStatus(responseData.serviceName, 'standby');

    res.send(responseData);
    //next();
}

var currentPort = 8080;

function makeNewPort(ip) {

    return ++ currentPort;
}

function addRoute(service) {

    exports.container.getRouteTable().add(service.serviceName, service.moduleName, []);

    return addDirection(service);
}

function addDirection(service) {

    var direction = {
        ip : service.serviceInfo.ip,
        port : service.serviceInfo.port
    };

    exports.container.getRouteTable().add(service.serviceName, service.moduleName, direction);

    return direction;
}

function extendService(req, res) {

    if(req.data.serviceName) {

        exports.container.getRouteTable().setStatus(req.data.serviceName, 'extending');
        createProcess();

        res.send({});
    }
}

function monitor() {

    // Calling monitor on entire container in the route table
    if(exports.container.getConfig('processType') !== 'single') {

        exports.container.broadcast('monitor', {}, function(err, res) {

            exports.container.log(res.data);
        });
    }
}

function initProject() {

    var routeTable = exports.container.getRouteTableJSON();

    for(var name in routeTable) {

        if(routeTable[name].status === 'off') {

            createProcess();
        }
    }
}

function createProcess() {

    if(process.env.NODE_ENV === 'test' || exports.container.getConfig('processType') === 'single') {

        var container = exports.container.createNewInstance();
        container.init('', '', function() {});

        processList.push(container);

        return;
    }

    var forever = require('forever-monitor');

    var child = new (forever.Monitor)('index.js', {
        max: 1
    });

    child.on('error', function (err) {
        console.log(err);
    });

    child.start();

    processList.push(child);
}