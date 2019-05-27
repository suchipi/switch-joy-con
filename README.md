# `switch-joy-con`

Use Nintendo Switch Joy-Cons as input devices (Bluetooth).

## Installation

```
npm install --save switch-joy-con
```

## Usage

```js
const { listConnectedJoyCons } = require("switch-joy-con");

// First, list all the Joy-Cons connected to the computer.
const devices = listConnectedJoyCons();
console.log(devices);
// [
//   {
//     vendorId: 1406,
//     productId: 8198,
//     path: 'IOService:/IOResources/IOBluetoothHCIController/AppleBroadcomBluetoothHostController/IOBluetoothDevice/IOBluetoothL2CAPChannel/IOBluetoothHIDDriver',
//     serialNumber: '94-58-cb-a6-1b-86',
//     manufacturer: 'Unknown',
//     product: 'Joy-Con (L)',
//     release: 1,
//     interface: -1,
//     usagePage: 1,
//     usage: 5,
//     open: [Function: open]
//   },
//   {
//     vendorId: 1406,
//     productId: 8199,
//     path: 'IOService:/IOResources/IOBluetoothHCIController/AppleBroadcomBluetoothHostController/IOBluetoothDevice/IOBluetoothL2CAPChannel/IOBluetoothHIDDriver',
//     serialNumber: '94-58-cb-a5-cb-9d',
//     manufacturer: 'Unknown',
//     product: 'Joy-Con (R)',
//     release: 1,
//     interface: -1,
//     usagePage: 1,
//     usage: 5,
//     open: [Function: open]
//   }
// ]

// Decide which to use, and then call `open` on it.
const left = devices[0].open();

// The `buttons` property always contains up-to-date buttons state:
console.log(left.buttons);
// {
//   dpadUp: false,
//   dpadDown: false,
//   dpadLeft: false,
//   dpadRight: false,
//   minus: false,
//   screenshot: false,
//   sl: false,
//   sr: false,
//   l: false,
//   zl: false,
//   analogStickPress: false,
//   analogStick: left.Directions.NEUTRAL
// }

// A "change" event will be emitted whenever the button state changes
left.on("change", () => {
  console.log(left.buttons);
});

// Whenever a button is pressed or released, a `down:${buttonName}` or `up:${buttonName}` event is emitted.
left.on("down:minus", () => {
  console.log("minus pressed down");
});
left.on("up:minus", () => {
  console.log("minus depressed");
});

// a `change:${buttonName}` event is also emitted:
left.on("change:minus", pressed => {
  console.log(`minus is now: ${pressed ? "pressed" : "unpressed"}`);
});

// The `analogStick` "button" is a number. Use the `Directions` property on the
// instance to understand its value:
left.on("change:analogStick", value => {
  switch (value) {
    case left.Directions.UP: {
      console.log("up");
      break;
    }
    case left.Directions.UP_RIGHT: {
      console.log("up-right");
      break;
    }
    case left.Directions.RIGHT: {
      console.log("right");
      break;
    }
    case left.Directions.DOWN_RIGHT: {
      console.log("down-right");
      break;
    }
    case left.Directions.DOWN: {
      console.log("down");
      break;
    }
    case left.Directions.DOWN_LEFT: {
      console.log("down-left");
      break;
    }
    case left.Directions.LEFT: {
      console.log("left");
      break;
    }
    case left.Directions.UP_LEFT: {
      console.log("up-left");
      break;
    }
    case left.Directions.UP_RIGHT: {
      console.log("up-right");
      break;
    }
    case left.Directions.NEUTRAL: {
      console.log("neutral");
      break;
    }
  }
});

// When you're done with the device, call `close` on it:
left.close();

// Usage with a right-side Joy-Con is the same, but it has different button names:
const right = devices[1].open();
console.log(right.buttons);
// {
//   a: false,
//   x: false,
//   b: false,
//   y: false,
//   plus: false,
//   home: false,
//   sl: false,
//   sr: false,
//   r: false,
//   zr: false,
//   analogStickPress: false,
//   analogStick: right.Directions.NEUTRAL
// }

// If you need to tell whether a Joy-Con is a left or right Joy-Con, use the `side` property:
console.log(left.side); // "left"
console.log(right.side); // "right"
```

## API Documentation

The `"switch-joy-con"` module has one named export, `listConnectedJoyCons`.

### `listConnectedJoyCons() => Array<JoyConDescription>`

Returns an array of objects, each describing a connected Joy-Con.

The objects have the following properties:

```ts
interface JoyConDescription {
  vendorId: number;
  productId: number;
  path: string;
  serialNumber: string;
  manufacturer: string;
  product: string;
  release: number;
  interface: number;
  usagePage: number;
  usage: number;
  open: () => JoyCon;
}
```

The most important thing here is the `open` method, which returns a `JoyCon` instance.

### `JoyCon`

You can obtain a `JoyCon` instance by calling `open` on a `JoyConDescription`, as returned by `listConnectedJoyCons()`.

Each `JoyCon` adheres to the following interface:

```ts
interface JoyCon extends EventEmitter {
  // Whether the Joy-Con attaches to the left or right side of a Switch.
  // The buttons will differ depending on this.
  side: "left" | "right";

  // An object containing the current button state.
  buttons:  // If `side` is "left", `buttons` will have the following properties:
    | {
        // If a button is pressed, its value will be `true`. Otherwise, it will be `false`.
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

        // Use the `Directions` property on the JoyCon to understand this number.
        analogStick: number;
      }
    // Otherwise (if `side` is "right"), `buttons` will have these properties:
    | {
        // If a button is pressed, its value will be `true`. Otherwise, it will be `false`.
        a: boolean;
        x: boolean;
        b: boolean;
        y: boolean;
        plus: boolean;
        home: boolean;
        sl: boolean;
        sr: boolean;
        r: boolean;
        zr: boolean;
        analogStickPress: boolean;

        // Use the `Directions` property on the JoyCon to understand this number.
        analogStick: number;
      };

  // The analog stick direction constants for this Joy-Con. Note that these differ
  // between left/right Joy-Cons, so always rely on this property.
  Directions: {
    LEFT: number;
    UP_LEFT: number;
    UP: number;
    UP_RIGHT: number;
    RIGHT: number;
    DOWN_RIGHT: number;
    DOWN: number;
    DOWN_LEFT: number;
    NEUTRAL: number;
  };

  // Call this method when you are done using the Joy-Con.
  // It won't be disconnected from Bluetooth, but the handle
  // will be released so it can be used by another application.
  close();
}
```

`JoyCon`s are also `EventEmitter`s, and they emit the following events:

- `change` - Button state has changed. Inspect the `buttons` property on the device for more info.
- `change:${buttonName}` - A specific button changed state. The event listener will be called with one argument, containing the new button value.
- `down:${buttonName}` - A specific button is now being held down.
- `up:${buttonName}` - A specific button is no longer being held down.

List of button names:

- `a`
- `x`
- `b`
- `y`
- `plus`
- `home`
- `l`
- `r`
- `zl`
- `zr`
- `dpadUp`
- `dpadDown`
- `dpadLeft`
- `dpadRight`
- `minus`
- `screenshot`
- `sl`
- `sr`
- `analogStickPress`
- `analogStick`

## License

MIT
