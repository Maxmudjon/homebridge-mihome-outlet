require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MiQingPinboardWithUSB = function(platform, config) {
    this.init(platform, config);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;

    this.accessories = {};
    if(!this.config['outletDisable'] && this.config['outletName'] && this.config['outletName'] != "") {
        this.accessories['outletAccessory'] = new MiQingPinboardWithUSBOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new MiQingPinboardWithUSBTemperature(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(MiQingPinboardWithUSB, Base);

MiQingPinboardWithUSBOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
    this.ip = dThis.config['ip'];
    this.token = dThis.config['token'];
}

MiQingPinboardWithUSBOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard With USB")
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

MiQingPinboardWithUSBOutlet.prototype.getOutletInUse = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["power_consume_rate"]).then(result => {
            that.platform.log.debug("[DEBUG]MiQingPinboardWithUSB - Outlet - getOutletInUse: " + result);
            callback(null, result[0] && result[0] > 0 ? true : false);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - getOutletInUse Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - getOutletInUse Error: " + err);
    });
}

MiQingPinboardWithUSBOutlet.prototype.getPower = function(callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["power"]).then(result => {
            that.platform.log.debug("[DEBUG]MiQingPinboardWithUSB - Outlet - getPower: " + result);
            callback(null, result[0] === 'on' ? 1 : 0);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - getPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - getPower Error: " + err);
    });
}

MiQingPinboardWithUSBOutlet.prototype.setPower = function(value, callback) {
    var that = this;

    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("set_power", [value ? "on" : "off"]).then(result => {
            that.platform.log.debug("[DEBUG]MiQingPinboardWithUSB - Outlet - setPower Result: " + result);
            if(result[0] === "ok") {
                callback(null);
            } else {
                callback(new Error(result[0]));
            }
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - setPower Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - setPower Error: " + err);
    });
}

MiQingPinboardWithUSBTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
    this.ip = dThis.config['ip'];
    this.token = dThis.config['token'];
}

MiQingPinboardWithUSBTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard With USB")
        .setCharacteristic(Characteristic.SerialNumber, this.ip);
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

MiQingPinboardWithUSBTemperature.prototype.getTemperature = function(callback) {
    var that = this;
    
    miio.device({
        address: this.ip,
        token: this.token
    })
    .then(result => {
        result.call("get_prop", ["temperature"]).then(result => {
            that.platform.log.debug("[DEBUG]MiQingPinboardWithUSB - Temperature - getTemperature: " + result);
            callback(null, result[0]);
        }).catch(function(err) {
            that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Temperature - getTemperature Error: " + err);
            callback(err);
        });
    })
    .catch(err => {
        that.platform.log.error("[ERROR]MiQingPinboardWithUSB - Outlet - getPower Error: " + err);
    });
}
