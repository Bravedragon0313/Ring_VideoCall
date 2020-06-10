"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
require("dotenv/config");
var ring_client_api_1 = require("ring-client-api");
var operators_1 = require("rxjs/operators");
var fs_1 = require("fs");
var util_1 = require("util");
var fs = require('fs');
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Devices_1 = require("./entity/Devices");
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var count, env, ringApi, locations, allCameras, _loop_1, _i, locations_1, location_1, _a, locations_2, location_2, cameras, devices, _b, cameras_1, camera, _c, devices_1, device;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    env = process.env, ringApi = new ring_client_api_1.RingApi({
                        // Replace with your refresh token
                        refreshToken: env.RING_REFRESH_TOKEN,
                        // Listen for dings and motion events
                        cameraDingsPollingSeconds: 2
                    });
                    return [4 /*yield*/, ringApi.getLocations()];
                case 1:
                    locations = _d.sent();
                    return [4 /*yield*/, ringApi.getCameras()];
                case 2:
                    allCameras = _d.sent();
                    console.log("Found " + locations.length + " location(s) with " + allCameras.length + " camera(s).");
                    ringApi.onRefreshTokenUpdated.subscribe(function (_a) {
                        var newRefreshToken = _a.newRefreshToken, oldRefreshToken = _a.oldRefreshToken;
                        return __awaiter(_this, void 0, void 0, function () {
                            var currentConfig, updatedConfig;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        console.log('Refresh Token Updated: ', newRefreshToken);
                                        if (!oldRefreshToken) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, util_1.promisify(fs_1.readFile)('.env')];
                                    case 1:
                                        currentConfig = _b.sent(), updatedConfig = currentConfig
                                            .toString()
                                            .replace(oldRefreshToken, newRefreshToken);
                                        return [4 /*yield*/, util_1.promisify(fs_1.writeFile)('.env', updatedConfig)];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    _loop_1 = function (location_1) {
                        location_1.onConnected.pipe(operators_1.skip(1)).subscribe(function (connected) {
                            var status = connected ? 'Connected to' : 'Disconnected from';
                            console.log("**** " + status + " location " + location_1.name + " - " + location_1.id);
                        });
                    };
                    for (_i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                        location_1 = locations_1[_i];
                        _loop_1(location_1);
                    }
                    _a = 0, locations_2 = locations;
                    _d.label = 3;
                case 3:
                    if (!(_a < locations_2.length)) return [3 /*break*/, 6];
                    location_2 = locations_2[_a];
                    cameras = location_2.cameras;
                    return [4 /*yield*/, location_2.getDevices()];
                case 4:
                    devices = _d.sent();
                    console.log("here device location", devices);
                    console.log("\nLocation " + location_2.name + " has the following " + cameras.length + " camera(s):");
                    for (_b = 0, cameras_1 = cameras; _b < cameras_1.length; _b++) {
                        camera = cameras_1[_b];
                        camera.onData.subscribe(function (data) {
                            // console.log("here camera data", data);
                            // console.log("device id", data.device_id);
                            //sipdata.push('[ring'+ringcount+']');
                        });
                        camera.startVideoOnDemand();
                        console.log("here camera pro- " + camera.id + ": " + camera.name + " (" + camera.deviceType + ")");
                    }
                    console.log("\nLocation " + location_2.name + " has the following " + devices.length + " device(s):");
                    for (_c = 0, devices_1 = devices; _c < devices_1.length; _c++) {
                        device = devices_1[_c];
                        console.log("- " + device.zid + ": " + device.name + " (" + device.deviceType + ")");
                        //sipdata.push('here deviceid:', device.id, device.name,device.deviceType)
                    }
                    _d.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    count = 0;
                    console.log("here conut", count);
                    if (allCameras.length) {
                        allCameras.forEach(function (camera) {
                            count++;
                            var ringcount = String(count).padStart(2, '0');
                            camera.onNewDing.subscribe(function (ding) {
                                var event = ding.kind === 'motion'
                                    ? 'Motion detected'
                                    : ding.kind === 'ding'
                                        ? 'Doorbell pressed'
                                        : "Video started (" + ding.kind + ")";
                                console.log("here event", event);
                                console.log(event + " on " + camera.name + " camera. Ding id " + ding.id_str + ". Received at " + new Date() + ". \"here server ip:\"" + ding.sip_server_ip + ". \"here server port:\"" + ding.sip_server_port + ". \"here sip token:\"" + ding.sip_token + ". \"here sip session id:\"" + ding.sip_session_id + ". \"here sip ding id:\"" + ding.sip_ding_id + ". \"here sip to:\"" + ding.sip_to.split(":")[2].split(';')[0] + ". \"here sip from:\"" + ding.sip_from + ". \"here snapshort:\" " + ding.snapshot_url + ". \"here device kind:\" " + ding.device_kind + ". \"here kind:\" " + ding.kind + ". \"here endpoints:\" " + ding.sip_endpoints + ". \"here id str:\" " + ding.id_str + ". \"here state:\" " + ding.state + ". \"here protocol:\" " + ding.protocol + ". \"here doorbot_description:\" " + ding.doorbot_description + ". \"here device_kind:\" " + ding.device_kind + ". \"here motion:\" " + ding.motion + ". \"here sip token:\" " + ding.sip_token + ". \"here sip ding id:\" " + ding.sip_ding_id);
                                console.log("here ringcount", ringcount);
                                var path = '../../../../../../../etc/asterisk/ring.d/' + 'ring' + ringcount + '.conf';
                                try {
                                    if (fs.existsSync(path)) {
                                        fs.unlinkSync(path);
                                        //file removed
                                        util_1.promisify(fs_1.writeFile)(path, '[ring' + ringcount + ']' + '\n' + 'type=aor' + '\n'
                                            + 'contact=sip:' + ding.sip_server_ip + ':' + ding.sip_to.split(":")[2].split(';')[0] + '\n' + '[ring' + ringcount + ']' + '\n' + 'type = endpoint' + '\n'
                                            + 'transport=transport-tls' + '\n' + 'ice_support = yes' + '\n' + 'allow=!all,ulaw,alaw,h264' + '\n' + 'aors=' + 'ring' + ringcount + '\n'
                                            + 'media_encryption=dtls' + '\n' + 'media_encryption=sdes' + '\n' + 'from_user=' + ding.sip_from.substring(4, 13) + '\n' + 'from_domain=ring.com' + '\n'
                                            + 'outbound_proxy=sip:' + ding.sip_server_ip + ':' + ding.sip_to.split(":")[2].split(';')[0] + '\n' + 'direct_media=no' + '\n' + 'direct_media_method=invite' + '\n'
                                            + 'dtmf_mode=info' + '\n' + 'use_avpf=yes');
                                    }
                                    else {
                                        util_1.promisify(fs_1.writeFile)(path, '[ring' + ringcount + ']' + '\n' + 'type=aor' + '\n'
                                            + 'contact=sip:' + ding.sip_server_ip + ':' + ding.sip_to.split(":")[2].split(';')[0] + '\n' + '[ring' + ringcount + ']' + '\n' + 'type = endpoint' + '\n'
                                            + 'transport=transport-tls' + '\n' + 'ice_support = yes' + '\n' + 'allow=!all,ulaw,alaw,h264' + '\n' + 'aors=' + 'ring' + ringcount + '\n'
                                            + 'media_encryption=dtls' + '\n' + 'media_encryption=sdes' + '\n' + 'from_user=' + ding.sip_from.substring(4, 13) + '\n' + 'from_domain=ring.com' + '\n'
                                            + 'outbound_proxy=sip:' + ding.sip_server_ip + ':' + ding.sip_to.split(":")[2].split(';')[0] + '\n' + 'direct_media=no' + '\n' + 'direct_media_method=invite' + '\n'
                                            + 'dtmf_mode=info' + '\n' + 'use_avpf=yes');
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                typeorm_1.createConnection({
                                    type: "mysql",
                                    host: "localhost",
                                    port: 3306,
                                    username: "ivan",
                                    password: "ELb8pCtVhHlcIjki",
                                    database: "ringd",
                                    entities: [
                                        __dirname + "/entity/*.ts"
                                    ],
                                    synchronize: true,
                                    logging: false
                                }).then(function (connection) { return __awaiter(_this, void 0, void 0, function () {
                                    var device;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("Inserting a new devices into the database...");
                                                device = new Devices_1.Devices();
                                                device.deviceid = 'ring' + ringcount;
                                                device.devicename = camera.name;
                                                device.motion_extension = ding.motion;
                                                if (ding.kind === 'motion') {
                                                    device.buttonpush_extension = false;
                                                    device.liveview_extension = false;
                                                }
                                                else if (event === 'Video started') {
                                                    device.buttonpush_extension = false;
                                                    device.liveview_extension = true;
                                                }
                                                else {
                                                    device.buttonpush_extension = true;
                                                    device.liveview_extension = false;
                                                }
                                                console.log("here database device", device);
                                                // await connection.manager.remove(device).then(result => {
                                                //   console.log(result);})
                                                return [4 /*yield*/, connection.manager.save(device).then(function (result) {
                                                        //console.log(result);
                                                        //console.log("Loading devices from the database...");
                                                        connection.manager.find('devices').then(function (devices) {
                                                            //console.log("Loaded devices: ", devices);
                                                        });
                                                    })];
                                            case 1:
                                                // await connection.manager.remove(device).then(result => {
                                                //   console.log(result);})
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })["catch"](function (error) { return console.log(error); });
                            });
                        });
                        console.log('Listening for motion and doorbell presses on your cameras.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
example();
