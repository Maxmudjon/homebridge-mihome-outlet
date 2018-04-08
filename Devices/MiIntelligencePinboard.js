require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MiIntelligencePinboard = function(platform, config) {
    this.init(platform, config);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
    
    this.accessories = {};
    if(!this.config['outletDisable'] && this.config['outletName'] && this.config['outletName'] != "") {
        this.accessories['outletAccessory'] = new MiIntelligencePinboardOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new MiIntelligencePinboardTemperature(this);
    }
    if(!this.config['switchLEDDisable'] && this.config['switchLEDName'] && this.config['switchLEDName'] != "") {
        this.accessories['switchLEDAccessory'] = new MiIntelligencePinboardSwitchLED(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(MiIntelligencePinboard, Base);

MiIntelligencePinboardOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
    this.ip = dThis.config['ip'];
    this.token = dThis.config['token'];
}

MiIntelligencePinboardOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
        .setCharacteristic(Characteristic.SerialNumber, this.ip);
    services.push(infoService);
    
    var outletService = new Service.Outlet(this.name);
    outletService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getPower.bind(this))
        .on('set', this.setPower.bind(this));
    outletService
        .getCharacteristic(Characteristic.OutletInUse)
        .on('get', this.getOutletInUse.bind(this));
    services.push(outletService);

    return services;
}

MiIntelligencePinboardOutlet.prototype.getOutletInUse = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["power_consume_rate"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - Outlet - getOutletInUse: " + result);
            callback(null, result[0] && result[0] > 0 ? true : false);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - getOutletInUse Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - getOutletInUse Error: " + err);
    });
}

MiIntelligencePinboardOutlet.prototype.getPower = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["power"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - Outlet - getPower: " + result);
            callback(null, result[0] === 'on' ? true : false);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - getPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - getPower Error: " + err);
    });
}

MiIntelligencePinboardOutlet.prototype.setPower = function(value, callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("set_power", [value ? "on" : "off"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - Outlet - setPower Result: " + result);
            if(result[0] === "ok") {
                callback(null);
            } else {
                callback(new Error(result[0]));
            }
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - setPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - Outlet - setPower Error: " + err);
    });
}

MiIntelligencePinboardTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
    this.ip = dThis.config['ip'];
    this.token = dThis.config['token'];
}

MiIntelligencePinboardTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
        .setCharacteristic(Characteristic.SerialNumber, this.ip);
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

MiIntelligencePinboardTemperature.prototype.getTemperature = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["temperature"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - Temperature - getTemperature: " + result);
            callback(null, result[0]);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - Temperature - getTemperature Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - Temperature - getTemperature Error: " + err);
    });
}

MiIntelligencePinboardSwitchLED = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['switchLEDName'];
    this.platform = dThis.platform;
    this.ip = dThis.config['ip'];
    this.token = dThis.config['token'];
}

MiIntelligencePinboardSwitchLED.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
        .setCharacteristic(Characteristic.SerialNumber, this.ip);
    services.push(infoService);
    
    var switchLEDService = new Service.Lightbulb(this.name);
    switchLEDService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getLEDPower.bind(this))
        .on('set', this.setLEDPower.bind(this));
    services.push(switchLEDService);

    return services;
}

MiIntelligencePinboardSwitchLED.prototype.getLEDPower = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["wifi_led"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - SwitchLED - getLEDPower: " + result);
            callback(null, result[0] === 'on' ? true : false);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - SwitchLED - getLEDPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - SwitchLED - getLEDPower Error: " + err);
    });
}

MiIntelligencePinboardSwitchLED.prototype.setLEDPower = function(value, callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("set_wifi_led", [value ? "on" : "off"]).then(result => {
            that.platform.log.debug("[DEBUG]MiIntelligencePinboard - SwitchLED - setLEDPower Result: " + result);
            if(result[0] === "ok") {
                callback(null);
            } else {
                callback(new Error(result[0]));
            }
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiIntelligencePinboard - SwitchLED - setLEDPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiIntelligencePinboard - SwitchLED - setLEDPower Error: " + err);
    });
}