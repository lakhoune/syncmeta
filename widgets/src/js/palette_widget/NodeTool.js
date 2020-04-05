define([
    'palette_widget/AbstractTool'
],/** @lends NodeTool */function(AbstractTool) {

    NodeTool.prototype = new AbstractTool();
    NodeTool.prototype.constructor = NodeTool;
    /**
     * NodeTool
     * @class palette_widget.NodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function NodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName,
            toolLabel,
            toolDescription||"Click on an empty part of the canvas to add a node",
            toolIcon||"class.png"
        );
    }

    return NodeTool;

});
