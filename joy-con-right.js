const JoyCon = require("./joy-con");

const Directions = {
  LEFT: 0x00,
  UP_LEFT: 0x01,
  UP: 0x02,
  UP_RIGHT: 0x03,
  RIGHT: 0x04,
  DOWN_RIGHT: 0x05,
  DOWN: 0x06,
  DOWN_LEFT: 0x07,
  NEUTRAL: 0x08
};

class JoyConRight extends JoyCon {
  constructor(path = null) {
    super(path);

    this.side = "right";
    this.Directions = Directions;

    this.buttons = {
      a: false,
      x: false,
      b: false,
      y: false,
      plus: false,
      home: false,
      sl: false,
      sr: false,
      r: false,
      zr: false,
      analogStickPress: false,
      analogStick: Directions.NEUTRAL
    };
  }

  _buttonsFromInputReport3F(bytes) {
    return {
      a: Boolean(bytes[1] & 0x01),
      x: Boolean(bytes[1] & 0x02),
      b: Boolean(bytes[1] & 0x04),
      y: Boolean(bytes[1] & 0x08),

      plus: Boolean(bytes[2] & 0x02),
      home: Boolean(bytes[2] & 0x10),

      sl: Boolean(bytes[1] & 0x10),
      sr: Boolean(bytes[1] & 0x20),

      r: Boolean(bytes[2] & 0x40),
      zr: Boolean(bytes[2] & 0x80),

      analogStickPress: Boolean(bytes[2] & 0x08),
      analogStick: bytes[3]
    };
  }
}

module.exports = JoyConRight;
