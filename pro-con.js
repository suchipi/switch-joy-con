const JoyCon = require("./joy-con");

class ProCon extends JoyCon {
  constructor(path = null) {
    super(path);

    this.side = null;

    this.buttons = {
      dpadUp: false,
      dpadDown: false,
      dpadLeft: false,
      dpadRight: false,
      a: false,
      x: false,
      b: false,
      y: false,
      minus: false,
      plus: false,
      screenshot: false,
      home: false,
      l: false,
      r: false,
      zl: false,
      zr: false,
      analogStickLPress: false,
      analogStickRPress: false,
      analogStickL: 130, // TODO: Need resarch.
      analogStickR: 130, // TODO: Need resarch.
    };
  }

  _buttonsFromInputReport3F(bytes) {
    return {
      dpadLeft: bytes[3] === 5 || bytes[3] === 6 || bytes[3] === 7,
      dpadDown: bytes[3] === 3 || bytes[3] === 4 || bytes[3] === 5,
      dpadUp: bytes[3] === 0 || bytes[3] === 1 || bytes[3] === 7,
      dpadRight: bytes[3] === 1 || bytes[3] === 2 || bytes[3] === 3,

      a: Boolean(bytes[1] & 0x02),
      x: Boolean(bytes[1] & 0x08),
      b: Boolean(bytes[1] & 0x01),
      y: Boolean(bytes[1] & 0x04),

      minus: Boolean(bytes[2] & 0x01),
      plus: Boolean(bytes[2] & 0x02),
      screenshot: Boolean(bytes[2] & 0x20),
      home: Boolean(bytes[2] & 0x10),

      l: Boolean(bytes[1] & 0x10),
      zl: Boolean(bytes[1] & 0x40),
      r: Boolean(bytes[1] & 0x20),
      zr: Boolean(bytes[1] & 0x80),

      analogStickLPress: Boolean(bytes[2] & 0x04),
      analogStickRPress: Boolean(bytes[2] & 0x08),

      analogStickL: bytes[5], // TODO: Need resarch.
      analogStickR: bytes[9]  // TODO: Need resarch.
    };
  }
}

module.exports = ProCon;