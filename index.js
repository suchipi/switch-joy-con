const HID = require("node-hid");
const JoyConLeft = require("./joy-con-left");
const JoyConRight = require("./joy-con-right");

function listConnectedJoyCons() {
  const devices = HID.devices();
  return devices
    .filter(device => device.vendorId === 1406)
    .map(device => {
      return Object.assign({}, device, {
        open(optionalSideOverride) {
          if (device.productId === 8198 || optionalSideOverride === "left") {
            return new JoyConLeft(device.path);
          } else if (
            device.productId === 8199 ||
            optionalSideOverride === "right"
          ) {
            return new JoyConRight(device.path);
          } else {
            throw new Error(
              "Unknown Joy-Con model '" +
                device.vendorId +
                ":" +
                device.productId +
                "'; cannot auto-detect whether it's a left-side or right-side Joy-Con. Pass either 'left' or 'right' as an argument to the open() method."
            );
          }
        }
      });
    });
}

module.exports = {
  listConnectedJoyCons
};
