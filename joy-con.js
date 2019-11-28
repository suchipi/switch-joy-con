const EventEmitter = require("events");
const HID = require("node-hid");

const LED_VALUES = {
  ONE: 1,
  TWO: 2,
  THREE: 4,
  FOUR: 8,
  ONE_FLASH: 16,
  TWO_FLASH: 32,
  THREE_FLASH: 64,
  FOUR_FLASH: 128,
};

class JoyCon extends EventEmitter {
  constructor(path) {
    super();

    this.LED_VALUES = LED_VALUES;
    this._globalPacketNumber = 0;
    this._device = new HID.HID(path);

    this._device.on("data", (bytes) => {
      this._handleData(bytes);
    });

    this.setInputReportMode(0x3f);
  }

  close() {
    this._device.close();
  }

  _send(data) {
    // See https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_notes.md

    this._globalPacketNumber = (this._globalPacketNumber + 0x1) % 0x10;

    const bytes = [...data];
    bytes[1] = this._globalPacketNumber;

    this._device.write(bytes);
  }

  setPlayerLEDs(value) {
    const bytes = new Array(0x40).fill(0);
    bytes[0] = 0x01;
    bytes[10] = 0x30;
    bytes[11] = value;

    this._send(bytes);
  }

  // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x03-set-input-report-mode
  setInputReportMode(value) {
    const bytes = new Array(0x40).fill(0);
    bytes[0] = 0x01;
    bytes[10] = 0x03;
    bytes[11] = value;

    this._send(bytes);
  }

  // emit(...args) {
  //   console.log(...args);
  //   super.emit(...args);
  // }

  _buttonsFromInputReport3F(bytes) {
    // Implement in subclass
  }

  _handleData(bytes) {
    if (bytes[0] !== 0x3f) return;

    const nextButtons = this._buttonsFromInputReport3F(bytes);

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

module.exports = JoyCon;
