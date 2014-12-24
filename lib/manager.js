exports.serviceName = 'MANAGER';
exports.container = null;

// container에서 호출 함
exports.init = function(container) {

    exports.container = container;

    container.addListener('init', initService);
    container.addListener('extend', extendService);

    // 모니터링 실행
    setInterval(monitor, 10000);
};

function initService(req, callback) {

    if(req.data.serviceName) {

        // service name이 없으면 필요한 업무 할당
    } else {

        // route table에 추가
    }
}

function extendService(req, callback) {

}

function monitor() {

    // 모니터링
}