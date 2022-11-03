import AbstractTool from "./AbstractTool";

MoveTool.prototype = new AbstractTool();
MoveTool.prototype.constructor = MoveTool;
/**
 * MoveTool
 * @class palette_widget.MoveTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function MoveTool(
  toolName = null,
  toolLabel = null,
  toolDescription = null,
  toolIcon = null
) {
  AbstractTool.call(
    this,
    toolName || "MoveTool",
    toolLabel || "Move",
    toolDescription ||
      "Move a node by dragging and dropping it. Resize a node by dragging and dropping its bottom right corner. Remove a node or edge by clicking on it with the right mouse button and selecting 'Delete'.",
    toolIcon || "arrow.png",
    "#FFFFFF"
  );
}

export default MoveTool;
