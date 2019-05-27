const EventEmitter = require("events");
const HID = require("node-hid");

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

class JoyConRight extends EventEmitter {
  constructor(path = null) {
    super();

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

    if (path == null) {
      const devices = HID.devices();
      for (let device of devices) {
        if (device.product === "Joy-Con (R)") {
          path = device.path;
          break;
        }
      }
    }

    if (path == null) {
      throw new Error(
        "It appears no right Joy-Con is connected to your computer. Check your bluetooth settings and try again."
      );
    }

    this._device = new HID.HID(path);

    this._device.on("data", bytes => {
      this._handleData(bytes);
    });
  }

  // emit(...args) {
  //   console.log(...args);
  //   super.emit(...args);
  // }

  close() {
    this._device.close();
  }

  _handleData(bytes) {
    const nextButtons = {
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

    Object.entries(nextButtons).forEach(([name, nextValue]) => {
      const currentValue = this.buttons[name];
      if (currentValue === false && nextValue === true) {
        this.emit(`down:${name}`);
      } else if (currentValue === true && nextValue === false) {
        this.emit(`up:${name}`);
      }

      if (currentValue !== nextValue) {
        this.emit(`change:${name}`, nextValue);
      }
    });

    this.buttons = nextButtons;
    this.emit("change");
  }
}

module.exports = JoyConRight;
