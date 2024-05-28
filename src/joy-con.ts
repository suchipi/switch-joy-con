import EventEmitter from "events";
import HID from "node-hid";
import makeDebug from "debug";

const debug = makeDebug("switch-joy-con:joy-con");
const ioDebug = makeDebug("switch-joy-con:io");

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

function numArrayToHexString(bytes: Array<number>): string {
  return "0x" + bytes.map((byte) => byte.toString(16)).join("");
}

export class JoyCon<Buttons extends {}> extends EventEmitter {
  LED_VALUES = LED_VALUES;

  _globalPacketNumber = 0;
  _device: HID.HID;

  // Subclass is expected to set this property in its constructor
  buttons!: Buttons;

  constructor(path: string | undefined | null) {
    super();

    this._device = new HID.HID(path!);

    this._device.on("data", (bytes) => {
      this._handleData(bytes);
    });

    // Simple mode. See https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x03-set-input-report-mode
    this.setInputReportMode(0x3f);
  }

  close() {
    if (debug.enabled) {
      debug(
        "Closing device: %s",
        this._device.generateDeviceInfo().product || "unnamed device",
      );
    }
    this._device.close();
  }

  _send(data: Array<number>) {
    // See https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_notes.md

    this._globalPacketNumber = (this._globalPacketNumber + 0x1) % 0x10;

    const bytes = [...data];
    bytes[1] = this._globalPacketNumber;

    if (ioDebug.enabled) {
      ioDebug(`OUT: ${numArrayToHexString(bytes)}`);
    }

    this._device.write(bytes);
  }

  setPlayerLEDs(value: number) {
    debug("Setting player LEDs value to: %d", value);

    const bytes = new Array(0x40).fill(0);
    bytes[0] = 0x01;
    bytes[10] = 0x30;
    bytes[11] = value;

    this._send(bytes);
  }

  // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x03-set-input-report-mode
  setInputReportMode(value: number) {
    debug("Setting input report mode to: %x", value);

    const bytes = new Array(0x40).fill(0);
    bytes[0] = 0x01;
    bytes[10] = 0x03;
    bytes[11] = value;

    this._send(bytes);
  }

  emit(...args: any) {
    debug("emitting event", ...args);
    // @ts-ignore spread of non-tuple
    return super.emit(...args);
  }

  _buttonsFromInputReport3F(_bytes: Array<number>): Buttons {
    // Implement in subclass
    throw new Error(
      "_buttonsFromInputReport3F not implemented in subclass " +
        this.constructor.name,
    );
  }

  _handleData(bytes: Array<number>) {
    if (ioDebug.enabled) {
      // extra space after 'IN' here is so it aligns with 'OUT'
      ioDebug(`IN : ${numArrayToHexString(bytes)}`);
    }

    if (bytes[0] !== 0x3f) return;
    debug("Handling input report 3F");

    const nextButtons = this._buttonsFromInputReport3F(bytes);

    for (const pair of Object.entries(nextButtons)) {
      const [name, nextValue] = pair as [keyof Buttons, Buttons[keyof Buttons]];

      const currentValue = this.buttons[name];
      if (currentValue === false && nextValue === true) {
        this.emit(`down:${String(name)}`);
      } else if (currentValue === true && nextValue === false) {
        this.emit(`up:${String(name)}`);
      }

      if (currentValue !== nextValue) {
        this.emit(`change:${String(name)}`, nextValue);
      }
    }

    this.buttons = nextButtons;
    this.emit("change");
  }
}
