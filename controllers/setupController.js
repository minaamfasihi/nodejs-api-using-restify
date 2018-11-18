module.exports = function(server, restify, restifyValidator) {
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.use(restifyValidator);

    
    server.use(restify.plugins.authorizationParser());

    server.use(function(req, res, next) {
        var whitelistedIps = ['111.222.333'];
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (whitelistedIps.indexOf(ip) === -1) {
            var response = {
                'status': 'failure',
                'data': 'Invalid IP Address'
            };
            res.setHeader('content-type', 'application/json');
            res.writeHead(403);
            res.end(JSON.stringify(response));
            return next();
        }
        return next();
    });

    server.use(function(req, res, next) {
        var apiKeys = {
            'user1': 'arwoeruiwoieur234'
        };
        if (typeof(req.authorization.basic) === 'undefined' || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]) {
            var response = {
                'status': 'failure',
                'data': 'Specify a valid API key'
            };
            res.setHeader('content-type', 'application/json');
            res.writeHead(403);
            res.end(JSON.stringify(response));
            return next();
        }
        return next();
    });

    server.use(restify.plugins.throttle({
        rate: 1,
        burst: 2,
        xff: true
    }));
}
