var restify = require('restify');
var server = restify.createServer();

var users = {};
var max_user_id = 0;

server.get("/", function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(users));
    return next();
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});