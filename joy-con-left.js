const JoyCon = require("./joy-con");

const Directions = {
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

class JoyConLeft extends JoyCon {
  constructor(path = null) {
    super(path);

    this.side = "left";
    this.Directions = Directions;

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
      analogStick: Directions.NEUTRAL,
    };
  }

  _buttonsFromInputReport3F(bytes) {
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

module.exports = JoyConLeft;
