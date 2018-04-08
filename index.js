require('./Devices/MiPlugBase');
require('./Devices/MiPlugBaseWithUSB');
require('./Devices/MiIntelligencePinboard');
require('./Devices/MiQingPinboard');
require('./Devices/MiQingPinboardWithUSB');

var fs = require('fs');
var packageFile = require("./package.json");
var PlatformAccessory, Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    if(!isConfig(homebridge.user.configPath(), "platforms", "MiHomeOutletPlatform")) {
        return;
    }
    
    PlatformAccessory = homebridge.platformAccessory;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerPlatform('homebridge-mi-outlet', 'MiHomeOutletPlatform', MiHomeOutletPlatform, true);
}

function isConfig(configFile, type, name) {
    var config = JSON.parse(fs.readFileSync(configFile));
    if("accessories" === type) {
        var accessories = config.accessories;
        for(var i in accessories) {
            if(accessories[i]['accessory'] === name) {
                return true;
            }
        }
    } else if("platforms" === type) {
        var platforms = config.platforms;
        for(var i in platforms) {
            if(platforms[i]['platform'] === name) {
                return true;
            }
        }
    } else {
    }
    
    return false;
}

function MiHomeOutletPlatform(log, config, api) {
    if(null == config) {
        return;
    }
    
    this.Accessory = Accessory;
    this.PlatformAccessory = PlatformAccessory;
    this.Service = Service;
    this.Characteristic = Characteristic;
    this.UUIDGen = UUIDGen;
    this.belgi = "\uD83D\uDD0C";    
    this.log = log;
    this.config = config;

    if (api) {
        this.api = api;
    }
    
    this.log.info("[INFO]", this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi);
    this.log.info("[INFO]  MiHomeOutletPlatform v%s By Maxmudjon", packageFile.version);
    this.log.info("[INFO]  GitHub: https://github.com/Maxmudjon/homebridge-mihome-outlet");
    this.log.info("[INFO]", this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi,this.belgi);
    this.log.info("[INFO]Start succes...");
}

MiHomeOutletPlatform.prototype = {
    accessories: function(callback) {
        var MiHomeAccessories = [];

        var outletDevices = this.config['outletDevices'];
        if(outletDevices instanceof Array) {
            for (var i = 0; i < outletDevices.length; i++) {
                var outletDevice = outletDevices[i];
                if(null == outletDevice['type'] || "" == outletDevice['type'] || null == outletDevice['token'] || "" == outletDevice['token'] || null == outletDevice['ip'] || "" == outletDevice['ip']) {
                    continue;
                }
                
                if (outletDevice['type'] == "MiPlugBase") {
                    new MiPlugBase(this, outletDevice).forEach(function(accessory, index, arr){
                        MiHomeAccessories.push(accessory);
                    });
                } else if (outletDevice['type'] == "MiPlugBaseWithUSB") {
                    new MiPlugBaseWithUSB(this, outletDevice).forEach(function(accessory, index, arr){
                        MiHomeAccessories.push(accessory);
                    });
                } else if (outletDevice['type'] == "MiIntelligencePinboard") {
                    new MiIntelligencePinboard(this, outletDevice).forEach(function(accessory, index, arr){
                        MiHomeAccessories.push(accessory);
                    });
                } else if (outletDevice['type'] == "MiQingPinboard") {
                    new MiQingPinboard(this, outletDevice).forEach(function(accessory, index, arr){
                        MiHomeAccessories.push(accessory);
                    });
                } else if (outletDevice['type'] == "MiQingPinboardWithUSB") {
                    new MiQingPinboardWithUSB(this, outletDevice).forEach(function(accessory, index, arr){
                        MiHomeAccessories.push(accessory);
                    });
                } else {
                }
            }
            this.log.info("[INFO]device size: " + outletDevices.length + ", accessories size: " + MiHomeAccessories.length);
        }
        
        callback(MiHomeAccessories);
    }
}