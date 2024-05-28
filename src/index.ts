import { JoyConLeft, LeftButtons, LeftDirections } from "./joy-con-left";
import { JoyConRight, RightButtons, RightDirections } from "./joy-con-right";
import { listConnectedJoyCons } from "./list-connected";
import { openNodeHidDeviceAsJoyCon } from "./open-device";

type JoyCon = JoyConLeft | JoyConRight;

export {
  listConnectedJoyCons,
  openNodeHidDeviceAsJoyCon,
  JoyConLeft,
  JoyConRight,
  LeftDirections,
  RightDirections,
  type JoyCon,
  type LeftButtons,
  type RightButtons,
};
