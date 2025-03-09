# comms-foxglove-extensions
University of Manitoba Robotics Team Custom Foxglove Extensions


This repo is a collection of custom Foxglove extensions used by UMRT.


* [joshnewans/foxglove-joystick](https://github.com/joshnewans/foxglove-joystick)
* [Lynxdrone/foxglove-battery-extension](https://github.com/Lynxdrone/foxglove-battery-extension)







## Development

### Install extension dependencies
Using node package manager, install the extension dependencies before compiling.
```sh
npm install
```

### Confirm extension build compiles
Confirm the extension is able to build without any errors.
```sh
npm run build
```

### Build local install
To build the package and test it on your local copy of Foxglove run ```local-install```
```sh
npm run local-install
```
After local installing, you can refresh open the **Foxglove App** or ```Ctrl+R``` to refresh if it is already open. You should be able to add your custom extension to the Foxglove UI.


### Build extension Package
This builds a single ```*.foxe``` file of the custom extension to be sent and uploaded to other devices without needing to compile.
```sh
npm run package
```