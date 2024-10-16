# YKColorPicker

YKColorPicker is a lightweight and flexible color picker library designed with a strong focus on user experience (UX), including full keyboard interaction support. It provides a seamless way to integrate a customizable color picker into your project, offering various color models such as RGB, HSV, HSL, and HEX.

## Usage

### Basic Setup

1. Initialize the color picker by passing a configuration object:

```javascript
const colorPicker = new YKColorPicker({
  target: document.getElementById("colorPickerButton"),
  color: "red", // initial color
  representation: YKColorPicker.RGB, // or 'hsv', 'hsl', 'hex'
});
```

2. Use the public methods to interact with the color picker:

```javascript
colorPicker.open(); // Opens the color picker
colorPicker.close(); // Closes the color picker
const rgbColor = colorPicker.getRGB(); // Retrieves the current color in RGB format
colorPicker.setColor("#ff5733"); // Sets the color using a HEX value
```

## UX Focus: Keyboard Interaction

YKColorPicker allows users to navigate and interact with the color picker through keyboard controls, offering an accessible experience.

- **Enter Key**: Confirms the selected color and closes the color picker.
- **Arrow Keys**: Adjust sliders for hue, saturation, value, or opacity and navigate through input fields.
- **Escape Key**: Closes the color picker and cancels changes if needed.

## Options

YKColorPicker provides a set of default options that can be customized during initialization or later via the `updateOptions` method. Below are the default options with explanations:

### Default Options

```javascript
static DEFAULT_OPTIONS = Object.freeze({
  target: null,
  container: null,
  position: YKColorPicker.BOTTOM,
  positionFallback: "btrl",
  representation: YKColorPicker.RGB,
  color: "red",
  closeOnScroll: true,
  closeOnResize: false,
  theme: "light",
  onInit: () => {},
  onOpen: () => {},
  onClose: () => {},
  onInput: () => {},
  onChange: () => {},
  onCopy: () => {},
  onRepresentationChange: () => {},
  onContainerChange: () => {},
});
```

### Explanation of Options

- **`target`**: The DOM element that triggers the color picker when clicked.
- **`container`**: The container element to which the color picker should be appended. If not set, it defaults to the body.

- **`position`**: Determines where the color picker appears relative to the target. Options include `YKColorPicker.TOP`, `YKColorPicker.BOTTOM`, `YKColorPicker.LEFT`, and `YKColorPicker.RIGHT`.

- **`positionFallback`**: Specifies the fallback positions when the default position doesn’t fit. For example, `"btrl"` tries Bottom, Top, Right, and Left, in that order.

- **`representation`**: Defines the color model used by the color picker. Options are `YKColorPicker.RGB`, `YKColorPicker.HSV`, `YKColorPicker.HSL`, and `YKColorPicker.HEX`.

- **`color`**: The initial color of the picker. This can be a HEX value, an RGB string, or a named color (like `"red"`).

- **`closeOnScroll`**: Whether the picker should close when the user scrolls the page.

- **`closeOnResize`**: Whether the picker should close when the window is resized.

- **`theme`**: The appearance of the picker. Options are `"light"` and `"dark"`.

- **`onInit`**: Callback function triggered when the picker is initialized.

- **`onOpen`**: Callback function triggered when the picker is opened.

- **`onClose`**: Callback function triggered when the picker is closed.

- **`onInput`**: Callback triggered when the user changes the color, this event behaves same as default `oninput` browser event.

- **`onChange`**: Callback triggered when the color has been changed, this event behaves same as default `onchange` browser event.

- **`onCopy`**: Callback triggered when the user copies the color value.

- **`onRepresentationChange`**: Callback triggered when the color model (representation) changes.

- **`onContainerChange`**: Callback triggered when the picker’s container changes.

### Customizing Options

You can pass custom options when initializing the color picker, or use the `updateOptions` method to change them dynamically.

#### Example: Customizing Options

```javascript
const colorPicker = new YKColorPicker({
  target: document.getElementById("colorPickerButton"),
  container: "colorPickerContainer", // Append the picker to a specific container
  position: YKColorPicker.TOP, // Position the picker above the target
  representation: YKColorPicker.HEX, // Start with HEX color representation
  color: "#00ff00", // Set the initial color to green
  closeOnScroll: false, // Keep the picker open on scroll
  theme: "dark", // Use the dark theme
  onChange: (picker) => {
    // Set a custom onChange callback
    console.log("Color changed:", picker.getColor());
  },
});
```

#### Example: Dynamically Updating Options

You can update the picker’s options after initialization using the `updateOptions` method:

```javascript
colorPicker.updateOptions({
  color: "#ff0000", // Change the color to red
  representation: YKColorPicker.RGB, // Switch to RGB representation
  theme: "light", // Switch to light theme
});
```

### Event/Callback Functions

YKColorPicker provides several event or callback functions, which allow you to hook into different stages of the color picker's lifecycle. These callbacks give you flexibility to execute custom actions, such as responding to color changes, picker openings, or other interactions.

#### 1. **`onInit(picker)`**

- **Description**: This callback is invoked when the color picker is initialized. It allows you to run custom code after the picker is set up and ready to be used.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onInit: (picker) => {
    console.log("Color picker initialized!", picker);
  },
});
```

#### 2. **`onOpen(picker)`**

- **Description**: This callback is triggered whenever the color picker is opened.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onOpen: (picker) => {
    console.log("Color picker opened!", picker.getColor());
  },
});
```

#### 3. **`onClose(picker)`**

- **Description**: This callback fires whenever the color picker is closed.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onClose: (picker) => {
    console.log("Color picker closed.");
  },
});
```

#### 4. **`onInput(picker)`**

- **Description**: This callback is invoked while the user is interacting with the picker and changing the color values. It’s useful for live previews as the color changes.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onInput: (picker) => {
    console.log("Color being updated:", picker.getColor());
  },
});
```

#### 5. **`onChange(picker)`**

- **Description**: This callback is triggered when the user confirms a color change. This can happen when the picker is closed or the user presses the "Enter" key to finalize the selection.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onChange: (picker) => {
    console.log("Color changed to:", picker.getColor());
  },
});
```

#### 6. **`onCopy(picker)`**

- **Description**: This callback is triggered when the user copies the current color value to the clipboard. It can be used to show a confirmation message or perform other related actions.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onCopy: (picker) => {
    console.log("Color copied:", picker.getColor());
  },
});
```

#### 7. **`onRepresentationChange(picker)`**

- **Description**: This callback is invoked when the user switches between different color models (e.g., from RGB to HEX). It allows you to respond to representation changes dynamically.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onRepresentationChange: (picker) => {
    console.log("Color representation changed to:", picker.getColor());
  },
});
```

#### 8. **`onContainerChange(picker, previousContainer)`**

- **Description**: This callback is triggered when the color picker’s container changes. It’s helpful when you want to track or react to the picker being moved or repositioned.
- **Parameters**:
  - `picker`: The YKColorPicker instance.
  - `previousContainer`: The previous container element the picker was in.
- **Example**:

```javascript
const colorPicker = new YKColorPicker({
  onContainerChange: (picker, previousContainer) => {
    console.log("Color picker moved to a new container.");
  },
});
```

## Example: Using Multiple Callbacks

```javascript
const colorPicker = new YKColorPicker({
  target: document.getElementById("colorPickerButton"),
  color: "#ff5733",
  onInit: (picker) => {
    console.log("Picker initialized with color:", picker.getColor());
  },
  onOpen: () => {
    console.log("Picker opened.");
  },
  onChange: (picker) => {
    console.log("Color changed:", picker.getColor());
  },
  onClose: () => {
    console.log("Picker closed.");
  },
});
```

## Methods

- **`isOpen()`**: Checks if the color picker is currently open.

- **`open()`**: Opens the color picker.

- **`close()`**: Closes the color picker.

- **`getRGB()`**: Returns the current color in RGB format.

- **`getHSV()`**: Returns the current color in HSV format.

- **`getHSL()`**: Returns the current color in HSL format.

- **`getHEX()`**: Returns the current color in HEX format.

- **`updateOptions(options)`**: Updates the color picker's configuration options.

- **`getColor()`**: Returns the current color based on the selected representation (RGB, HSV, HSL, or HEX).

- **`setColor(value)`**: Sets the current color using a value (HEX, RGB, or named color).

## License

This project is licensed under the MIT License.
