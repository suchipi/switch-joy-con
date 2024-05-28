import HID from "node-hid";
import { openNodeHidDeviceAsJoyCon } from "./open-device";
import makeDebug from "debug";

const debug = makeDebug("switch-joy-con:list-connected");

export function listConnectedJoyCons() {
  const devices = HID.devices();
  return devices
    .filter((device) => {
      const shouldInclude = device.vendorId === 1406;
      if (shouldInclude) {
        debug("Found device at %s", device.path || "null");
      } else {
        debug("Skipping device at %s", device.path || "null");
      }
      return shouldInclude;
    })
    .map((device) => {
      return Object.assign({}, device, {
        open(optionalSideOverride: "left" | "right") {
          return openNodeHidDeviceAsJoyCon(device, optionalSideOverride);
        },
      });
    });
}
