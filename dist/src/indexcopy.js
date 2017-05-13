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
const jsonfile = require("jsonfile");
exports.CONFIG = {
    responses: [],
    monitorLength: 5,
    timeout: 2,
    timeRange: 1
};
exports.G = {
    timeout: 2,
    monitorLength: 60,
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
function collectUsage() {
    pidusage.stat(process.pid, (err, stat) => {
        // remove the first element of the response list if the length longer than monitorLength
        if (exports.CONFIG.responses.length >= exports.CONFIG.monitorLength)
            exports.CONFIG.responses.shift();
        // Collect the memory, cpu, timestamp; 
        // Init the response count, response time and timerange  
        const statRecord = {
            memory: stat.memory / 1024 / 1024,
            cpu: stat.cpu,
            timestamp: Date.now(),
            count: 0,
            responseTime: 0,
            timeRange: exports.CONFIG.timeRange
        };
        exports.CONFIG.responses.push(statRecord);
    });
}
function responseCount(lastResponse) {
    if (!lastResponse)
        return;
    lastResponse.count++;
    let meanTime = lastResponse.responseTime;
    lastResponse.responseTime = meanTime + (exports.CONFIG.timeout * 1000 - meanTime) / lastResponse.count;
}
function responseTime(startTime, lastResponse) {
    if (!lastResponse)
        return;
    let responseTime = process.hrtime(startTime);
    responseTime = responseTime[0] * 10e3 + responseTime[1] * 10E-6;
    let meanTime = lastResponse.responseTime;
    lastResponse.responseTime = meanTime + (responseTime - exports.CONFIG.timeout * 1000) / lastResponse.count;
}
function startMonitoring() {
    const interval = setInterval(() => collectUsage(), exports.CONFIG.timeRange * 1000);
    interval.unref();
}
function monitoringMiddlewareWrapper(app, config) {
    startMonitoring();
    return function monitoring(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const lastResponse = lastElement(exports.CONFIG.responses);
            responseCount(lastResponse);
            yield next();
            responseTime(startTime, lastResponse);
            let file = 'output/data.json';
            jsonfile.writeFile(file, exports.CONFIG, function (err) {
            });
        });
    };
}
exports.default = monitoringMiddlewareWrapper;