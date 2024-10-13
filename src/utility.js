export function hexPad2(value) {
  return value.toString(16).padStart(2, "0");
}

export function createElement(tag, classList, attributes) {
  const el = document.createElement(tag);
  if (classList != null) {
    el.classList.add(...classList);
  }
  if (attributes) {
    for (const key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        el.setAttribute(key, attributes[key]);
      }
    }
  }
  return el;
}

export function attachEvent(element, eventName, eventHandler) {
  element.addEventListener(eventName, eventHandler);
}

export default {
  hexPad2,
  createElement,
  attachEvent,
};
