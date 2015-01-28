"use strict";

exports.serviceName = 'MANAGER';
exports.moduleName = 'managerservice';
exports.container = null;

var monitoringInterval = null;

var containerList = [];

// container에서 호출 함
exports.init = function(container, callback) {

    exports.container = container;

    container.addListener('init', initService);
    container.addListener('extend', extendService);
/*
    container.getRouteTableJSON()[this.serviceName].status = 'on';
    container.saveRouteTable();
*/
    exports.container.getRouteTable().setStatus(exports.serviceName, 'standby');

    initProject();

    // 모니터링 실행
    monitoringInterval = setInterval(monitor, 10000);

    callback(null);
};

exports.close = function(callback) {

    if(monitoringInterval) {

        clearInterval(monitoringInterval);
    }

    callback(null);
};

exports.monitor = monitor;

function initService(req, res) {

    var routeTable = exports.container.getRouteTableJSON();
    var responseData = {
        serviceName : '',
        moduleName : '',
        serviceInfo : {
            ip : req.connection.remoteAddress,
            port : makeNewPort(req.connection.remoteAddress)
        }
    };

    if(req.data.serviceName) {

        // route table에 추가
        //exports.container.getRouteTable().add(req.data.serviceName, req.data.moduleName, {ip : '', port : ''});
        responseData.serviceName = req.data.serviceName;
        responseData.moduleName = req.data.moduleName;

        if(routeTable[req.data.serviceName]) {

            // routetable에 정보가 있다면
            addDirection(responseData);
        } else {

            addRoute(responseData);
        }

    } else {

        // service name이 없으면 필요한 업무 할당

        for(var name in routeTable) {

            if(routeTable[name].status === 'off') {

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

    res.end('OK');
    //next();
}

function monitor() {

    // 모니터링
    
    // route table 전체 container에 monitoring 호출
    exports.container.broadcast('monitor', {}, function(err, res) {

        exports.container.log(res.data);
    });

}

function initProject() {

    var forever = require('forever-monitor');

    var routeTable = exports.container.getRouteTableJSON();

    for(var name in routeTable) {

        if(routeTable[name].status === 'off') {

            var child = new (forever.Monitor)('index.js', {
                max: 3
            });

            child.on('start', function (process, data) {
                console.log(data);
            });

            child.on('error', function (err) {
                console.log(err);
            });

            child.start();
        }
    }
}