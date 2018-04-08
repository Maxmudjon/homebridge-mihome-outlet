# homebridge-mihome-outlet
[![npm version](https://badge.fury.io/js/homebridge-mihome-outlet.svg)](https://badge.fury.io/js/homebridge-mihome-outlet)

XiaoMi outlet plugins for HomeBridge.   
   
Thanks for [nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), [OpenMiHome](https://github.com/OpenMiHome/mihome-binary-protocol), [aholstenson](https://github.com/aholstenson)(the author of [miio](https://github.com/aholstenson/miio)), all other developer and testers.   
   
**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/Maxmudjon/homebridge-mihome-outlet/issues).**

**this plugin uses the miio version 0.15.6 or newer, unlike many other plugins version 0.14.1. Timeouts, API errors are now a thing of the past** 

![](https://raw.githubusercontent.com/Maxmudjon/homebridge-mihome-outlet/master/images/PlugBase.jpg)
![](https://raw.githubusercontent.com/Maxmudjon/homebridge-mihome-outlet/master/images/PlugBaseWithUSB.jpg)
![](https://raw.githubusercontent.com/Maxmudjon/homebridge-mihome-outlet/master/images/IntelligencePinboard.jpg)
![](https://raw.githubusercontent.com/Maxmudjon/homebridge-mihome-outlet/master/images/QingPinboard.jpg)
![](https://raw.githubusercontent.com/Maxmudjon/homebridge-mihome-outlet/master/images/QingPinboardWithUSB.jpg)

## Supported Devices
1.MiPlugBase   
2.MiPlugBaseWithUSB   
3.MiIntelligencePinboard   
4.MiQingPinboard   
5.MiQingPinboardWithUSB   
## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).   
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.   
3. Install packages.   
```
npm install -g homebridge-mihome-outlet
```
## Configuration
### if you only have 'MiPlugBase'
```
"platforms": [{
    "platform": "MiHomeOutletPlatform",
    "outletDevices": [{
        "type": "MiPlugBase",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "office room led light switch",
        "switchLEDDisable": false
    }]
}]
```
### if you only have 'MiPlugBaseWithUSB'
```
"platforms": [{
    "platform": "MiHomeOutletPlatform",
    "outletDevices": [{
        "type": "MiPlugBaseWithUSB",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false,
        "switchUSBName": "office room outlet usb switch",
        "switchUSBDisable": false
    }]
}]
```
### or use all
```
"platforms": [{
    "platform": "MiHomeOutletPlatform",
    "outletDevices": [{
        "type": "MiPlugBase",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "office room led light switch",
        "switchLEDDisable": false
    }, {
        "type": "MiPlugBaseWithUSB",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false,
        "switchUSBName": "office room outlet usb switch",
        "switchUSBDisable": false
    }, {
        "type": "MiIntelligencePinboard",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "office room led light switch",
        "switchLEDDisable": false
    }, {
        "type": "MiQingPinboard",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false
    }, {
        "type": "MiQingPinboardWithUSB",
        "ip": "192.168.1.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "office room outlet",
        "outletDisable": false,
        "temperatureName": "office room outlet temperature",
        "temperatureDisable": false
    }]
}]
```
## Get token
### Get token by miio2.db
setup MiJia(MiHome) app in your android device or android virtual machine.   
open MiJia(MiHome) app and login your account.   
refresh device list and make sure device display in the device list.   
get miio2.db(path: /data/data/com.xiaomi.smarthome/databases/miio2.db) file from your android device or android virtual machine.   
open website [[Get MiIo Tokens By DataBase File](http://miio2.yinhh.com/)], upload miio2.db file and submit.    
### Get token by network
Open command prompt or terminal. Run following command:
```
miio --discover
```
Wait until you get output similar to this:
```
Device ID: xxxxxxxx   
Model info: Unknown   
Address: 192.168.1.xx   
Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx via auto-token   
Support: Unknown   
```
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" is token.   
If token is "???", then reset device and connect device created Wi-Fi hotspot.   
Run following command:   
```
miio --discover --sync
```
Wait until you get output.   
For more information about token, please refer to [OpenMiHome](https://github.com/OpenMiHome/mihome-binary-protocol) and [miio](https://github.com/aholstenson/miio).   
## Version Logs
### 0.0.42 (2018-04-09)
1.add support for PlugBase: outlet, temperature sensor, LED switch.   
2.add support for PlugBaseWithUSB: outlet, temperature sensor, USB switch.   
3.add support for Intelligence Pinboard: outlet, temperature sensor, LED switch.   
4.add support for Qing Pinboard: outlet, temperature sensor.   
5.add support for Qing Pinboard With USB: outlet, temperature sensor.   
   



