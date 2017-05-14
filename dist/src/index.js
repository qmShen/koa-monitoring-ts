'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pidusage = require("pidusage");
exports.GLOBALCONFIG = {
    timeout: 2,
    monitorLength: 20,
    spans: [{
            responses: [],
            timeRange: 1
        }, {
            responses: [],
            timeRange: 5
        }, {
            responses: [],
            timeRange: 10
        }]
};
// Return the last element of an array, return null if bad input
function lastElement(array) {
    return (!array || !array.length) ? null : array[array.length - 1];
}
function collectUsage(span) {
    pidusage.stat(process.pid, (err, stat) => {
        // remove the first element of the response list if the length longer than monitorLength
        if (span.responses.length >= exports.GLOBALCONFIG.monitorLength / span.timeRange)
            span.responses.shift();
        // Collect the memory, cpu, timestamp; 
        // Init the response count, response time and timerange  
        const statRecord = {
            memory: stat.memory / 1024 / 1024,
            cpu: stat.cpu,
            timestamp: Date.now(),
            count: 0,
            responseTime: 0,
            timeRange: span.timeRange
        };
        span.responses.push(statRecord);
    });
}
function responseCount(lastResponses) {
    lastResponses.forEach(lastResponse => {
        if (!lastResponse)
            return;
        lastResponse.count++;
        let meanTime = lastResponse.responseTime;
        lastResponse.responseTime = meanTime + (exports.GLOBALCONFIG.timeout * 1000 - meanTime) / lastResponse.count;
    });
}
function responseTime(startTime, lastResponses) {
    lastResponses.forEach(lastResponse => {
        if (!lastResponse)
            return;
        let responseTime = process.hrtime(startTime);
        responseTime = responseTime[0] * 10e3 + responseTime[1] * 10E-6;
        let meanTime = lastResponse.responseTime;
        lastResponse.responseTime = meanTime + (responseTime - exports.GLOBALCONFIG.timeout * 1000) / lastResponse.count;
    });
}
function startMonitoring() {
    exports.GLOBALCONFIG.spans.forEach((span) => {
        const interval = setInterval(() => collectUsage(span), span.timeRange * 1000);
        interval.unref();
    });
}
function monitoringMiddlewareWrapper(app, config) {
    startMonitoring();
    return function monitoring(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            let lastResponses = [];
            exports.GLOBALCONFIG.spans.forEach(function (span) {
                lastResponses.push(lastElement(span.responses));
            });
            responseCount(lastResponses);
            yield next();
            responseTime(startTime, lastResponses);
        });
    };
}
exports.default = monitoringMiddlewareWrapper;
