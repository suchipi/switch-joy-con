const HID = require("node-hid");
const JoyConLeft = require("./joy-con-left");
const JoyConRight = require("./joy-con-right");
const ProCon = require("./pro-con");

function listConnectedJoyCons() {
  const devices = HID.devices();
  return devices
    .filter(device => device.vendorId === 1406)
    .map(device => {
      return Object.assign({}, device, {
        open() {
          if (device.productId === 8198) {
            return new JoyConLeft(device.path);
          } else if (device.productId === 8199) {
            return new JoyConRight(device.path);
          } else if (device.productId === 8201) {
            return new ProCon(device.path);
          } else {
            throw new Error("Unknown Joy-Con model");
          }
        }
      });
    });
}

module.exports = {
  listConnectedJoyCons
};
