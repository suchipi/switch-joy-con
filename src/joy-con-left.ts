import { JoyCon } from "./joy-con";

export const LeftDirections = {
  RIGHT: 0x00,
  DOWN_RIGHT: 0x01,
  DOWN: 0x02,
  DOWN_LEFT: 0x03,
  LEFT: 0x04,
  UP_LEFT: 0x05,
  UP: 0x06,
  UP_RIGHT: 0x07,
  NEUTRAL: 0x08,
};

export type LeftButtons = {
  dpadUp: boolean;
  dpadDown: boolean;
  dpadLeft: boolean;
  dpadRight: boolean;
  minus: boolean;
  screenshot: boolean;
  sl: boolean;
  sr: boolean;
  l: boolean;
  zl: boolean;
  analogStickPress: boolean;
  analogStick: number;
};

export class JoyConLeft extends JoyCon<LeftButtons> {
  side: "left" = "left";
  Directions = LeftDirections;

  constructor(path: string | undefined | null = null) {
    super(path);

    this.buttons = {
      dpadUp: false,
      dpadDown: false,
      dpadLeft: false,
      dpadRight: false,
      minus: false,
      screenshot: false,
      sl: false,
      sr: false,
      l: false,
      zl: false,
      analogStickPress: false,
      analogStick: LeftDirections.NEUTRAL,
    };
  }

  _buttonsFromInputReport3F(bytes: Array<number>) {
    return {
      dpadLeft: Boolean(bytes[1] & 0x01),
      dpadDown: Boolean(bytes[1] & 0x02),
      dpadUp: Boolean(bytes[1] & 0x04),
      dpadRight: Boolean(bytes[1] & 0x08),

      minus: Boolean(bytes[2] & 0x01),
      screenshot: Boolean(bytes[2] & 0x20),

      sl: Boolean(bytes[1] & 0x10),
      sr: Boolean(bytes[1] & 0x20),

      l: Boolean(bytes[2] & 0x40),
      zl: Boolean(bytes[2] & 0x80),

      analogStickPress: Boolean(bytes[2] & 0x04),
      analogStick: bytes[3],
    };
  }
}
