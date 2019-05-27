const HID = require("node-hid");
const JoyConLeft = require("./joy-con-left");
const JoyConRight = require("./joy-con-right");

function listConnectedJoyCons() {
  const devices = HID.devices();
  return devices
    .filter(device => device.product.match(/Joy-Con/))
    .map(device => {
      return Object.assign({}, device, {
        open() {
          if (device.product.match(/\(L\)/)) {
            return new JoyConLeft(device.path);
          } else if (device.product.match(/\(R\)/)) {
            return new JoyConRight(device.path);
          }
        }
      });
    });
}

module.exports = {
  listConnectedJoyCons
};
