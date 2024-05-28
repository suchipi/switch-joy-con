const HID = require("node-hid");
const JoyConLeft = require("./joy-con-left");
const JoyConRight = require("./joy-con-right");

const knownProducts = {
  // Official Nintendo Switch Joy-Con (L)
  "1406:8198": {
    side: "left",
  },
  // Official Nintendo Switch Joy-Con (R)
  "1406:8199": {
    side: "right",
  },
  // A pair of third-party Joy-Cons I own (no branding). Both sides (left/right)
  // report same product id, so we can't make any assumptions about side.
  "1406:8201": {
    side: undefined,
  },
};

function openNodeHidDeviceAsJoyCon(device, optionalSideOverride) {
  const knownProduct = knownProducts[`${device.vendorId}:${device.productId}`];

  const side =
    optionalSideOverride || (knownProduct ? knownProduct.side : null) || null;

  switch (side) {
    case "left": {
      return new JoyConLeft(device.path);
    }
    case "right": {
      return new JoyConRight(device.path);
    }
    default: {
      if (device.product && device.product.endsWith("(L)")) {
        return new JoyConLeft(device.path);
      } else if (device.product && device.product.endsWith("(R)")) {
        return new JoyConRight(device.path);
      } else {
        throw new Error(
          `Cannot auto-detect whether Joy-Con with vendor:product id '${device.vendorId}:${device.productId}' is a left-side or right-side Joy-Con. Pass either 'left' or 'right' as an argument to the open() method.`,
        );
      }
    }
  }
}

function listConnectedJoyCons() {
  const devices = HID.devices();
  return devices
    .filter((device) => device.vendorId === 1406)
    .map((device) => {
      return Object.assign({}, device, {
        open(optionalSideOverride) {
          return openNodeHidDeviceAsJoyCon(device, optionalSideOverride);
        },
      });
    });
}

module.exports = {
  listConnectedJoyCons,
  openNodeHidDeviceAsJoyCon,
  JoyConLeft,
  JoyConRight,
};
