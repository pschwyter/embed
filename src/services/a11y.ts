/**
 * Used to suppress the outline on clickable elements when clicked, but not when tabbed to
 */
export const outlineSuppressionHandlers = {
  onMouseDown: e => {
    e.currentTarget.style.outline = "none";
  },
  onBlur: e => {
    e.currentTarget.style.outline = "";
  }
};
