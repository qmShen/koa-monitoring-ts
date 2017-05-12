'use strict';
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("mz/fs");
var path = require("path");
var os = require("os");
var pidusage = require("pidusage");
var handlebars = require("handlebars");
var socket = require("socket.io");
var io;
var defaultConfig = {
    path: '/status',
    title: 'monitoring',
    spans: [{
            interval: 1,
            retention: 60
        }, {
            interval: 5,
            retention: 60
        }, {
            interval: 15,
            retention: 60
        }]
};
var last = function (arr) {
    return arr[arr.length - 1];
};
var gatherOsMetrics = function (io, span) {
    var defaultResponse = {
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        count: 0,
        mean: 0,
        timestamp: Date.now()
    };
    var sendMetrics = function (span) {
        var emitMsg = {
            os: span.os[span.os.length - 2],
            responses: span.responses[span.responses.length - 2],
            interval: span.interval,
            retention: span.retention
        };
        io.emit('stats', emitMsg);
    };
    pidusage.stat(process.pid, function (err, stat) {
        if (err) {
            console.error(err);
            return;
        }
        stat.memory = stat.memory / 1024 / 1024; // Convert from B to MB
        stat.load = os.loadavg();
        stat.timestamp = Date.now();
        span.os.push(stat);
        if (!span.responses[0] || last(span.responses).timestamp + (span.interval * 1000) < Date.now())
            span.responses.push(defaultResponse);
        if (span.os.length >= span.retention)
            span.os.shift();
        if (span.responses[0] && span.responses.length > span.retention)
            span.responses.shift();
        sendMetrics(span);
    });
};
var encoding = { encoding: 'utf8' };
var middlewareWrapper = function (app, config) {
    if (!app.listen) {
        throw new Error('First parameter must be an http server');
    }
    io = socket(app);
    Object.assign(defaultConfig, config);
    config = defaultConfig;
    var htmlFilePath = path.join(__dirname, 'index.html');
    var indexHtml = fs.readFileSync(htmlFilePath, encoding);
    var template = handlebars.compile(indexHtml);
    io.on('connection', function (socket) {
        socket.emit('start', config.spans);
        socket.on('change', function () {
            socket.emit('start', config.spans);
        });
    });
    config.spans.forEach(function (span) {
        span.os = [];
        span.responses = [];
        var interval = setInterval(function () { return gatherOsMetrics(io, span); }, span.interval * 1000);
        interval.unref();
    });
    // console.log(config)
    return function (next) {
        var _this = this;
        function record(timeout) {
            var diff = process.hrtime(startTime);
            var responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
            // if timeout, set response code to 5xx.
            var category = timeout ? 5 : Math.floor(this.statusCode / 100);
            config.spans.forEach(function (span) {
                var lastResponse = last(span.responses);
                if (lastResponse && lastResponse.timestamp / 1000 + span.interval > Date.now() / 1000) {
                    lastResponse[category]++;
                    lastResponse.count++;
                    lastResponse.mean = lastResponse.mean + ((responseTime - lastResponse.mean) / lastResponse.count);
                }
                else {
                    span.responses.push({
                        '2': category === 2 ? 1 : 0,
                        '3': category === 3 ? 1 : 0,
                        '4': category === 4 ? 1 : 0,
                        '5': category === 5 ? 1 : 0,
                        count: 1,
                        mean: responseTime,
                        timestamp: Date.now()
                    });
                }
            });
        }
        var startTime, pathToJs, _a, timer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = process.hrtime();
                    if (!(this.path === config.path)) return [3 /*break*/, 1];
                    this.body = template(config);
                    return [3 /*break*/, 5];
                case 1:
                    if (!(this.url === config.path + "/koa-monitor-frontend.js")) return [3 /*break*/, 3];
                    pathToJs = path.join(__dirname, 'koa-monitor-frontend.js');
                    _a = this;
                    return [4 /*yield*/, fs.readFile(pathToJs, encoding)];
                case 2:
                    _a.body = _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    timer = void 0;
                    if (config.requestTimeout) {
                        timer = setTimeout(function () {
                            record.call(_this, true);
                        }, config.requestTimeout);
                    }
                    return [4 /*yield*/, next];
                case 4:
                    _b.sent();
                    timer && clearTimeout(timer);
                    record.call(this);
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    };
};
module.exports = middlewareWrapper;
