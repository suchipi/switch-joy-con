import HID from "node-hid";
import { JoyConLeft } from "./joy-con-left";
import { JoyConRight } from "./joy-con-right";
import makeDebug from "debug";

const debug = makeDebug("switch-joy-con:open-device");

const knownProducts: {
  [vendorAndProductId: string]:
    | undefined
    | { side: "left" | "right" | undefined };
} = {
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

export function openNodeHidDeviceAsJoyCon(
  device: HID.Device,
  optionalSideOverride?: "left" | "right",
) {
  const vendorAndProductId = `${device.vendorId}:${device.productId}`;
  const knownProduct = knownProducts[vendorAndProductId];

  if (knownProduct) {
    debug(
      "Device at %s matches known vendor/product id %s",
      device.path || "null",
      vendorAndProductId,
    );
  } else {
    debug(
      "Device at %s with vendor/product id %s is not recognized; trying to use it anyway",
      device.path || "null",
      vendorAndProductId,
    );
  }

  const side =
    optionalSideOverride || (knownProduct ? knownProduct.side : null) || null;

  switch (side) {
    case "left": {
      debug(
        "Initializing device %s as left-side JoyCon",
        device.path || "null",
      );
      return new JoyConLeft(device.path);
    }
    case "right": {
      debug(
        "Initializing device %s as right-side JoyCon",
        device.path || "null",
      );
      return new JoyConRight(device.path);
    }
    default: {
      if (device.product && device.product.endsWith("(L)")) {
        debug(
          "Initializing device %s as left-side JoyCon (due to name ending with '(L)')",
          device.path || "null",
        );
        return new JoyConLeft(device.path);
      } else if (device.product && device.product.endsWith("(R)")) {
        debug(
          "Initializing device %s as right-side JoyCon (due to name ending with '(R)')",
          device.path || "null",
        );
        return new JoyConRight(device.path);
      } else {
        throw new Error(
          `Cannot auto-detect whether Joy-Con with vendor:product id '${device.vendorId}:${device.productId}' is a left-side or right-side Joy-Con. Pass either 'left' or 'right' as an argument to the open() method.`,
        );
      }
    }
  }
}
