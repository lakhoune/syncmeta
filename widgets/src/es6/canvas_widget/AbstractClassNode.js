import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import AbstractNode from "./AbstractNode";
import KeySelectionValueListAttribute from "./KeySelectionValueListAttribute";
import $__canvas_widget_ObjectNode from "./ObjectNode";
import $__canvas_widget_RelationshipNode from "./RelationshipNode";
import $__canvas_widget_RelationshipGroupNode from "./RelationshipGroupNode";
import loadHTML from "../html.template.loader";

const abstractClassNodeHtml = await loadHTML(
  "../../templates/canvas_widget/abstract_class_node.html",
  import.meta.url
);

/**
 * Abstract Class Node
 * @class canvas_widget.AbstractClassNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 */
class AbstractClassNode extends AbstractNode {
  constructor(id, left, top, width, height, zIndex, json) {
    super(id, AbstractClassNode.TYPE, left, top, width, height, zIndex, json);

    var that = this;

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(abstractClassNodeHtml)({ type: that.getType() })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("class");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      var json = AbstractNode.prototype.toJSON.call(this);
      json.type = AbstractClassNode.TYPE;
      return json;
    };

    var attr = new KeySelectionValueListAttribute(
      "[attributes]",
      "Attributes",
      this,
      {
        string: "String",
        boolean: "Boolean",
        integer: "Integer",
        file: "File",
        quiz: "Questions",
      }
    );
    this.addAttribute(attr);

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      attr.registerYMap();
    };

    this.unregisterCallbacks = function () {
      that.getAttribute("[attributes]").unregisterCallbacks();
    };

    _$node.find(".label").append(this.getLabel().get$node());

    for (var attributeKey in _attributes) {
      if (_attributes.hasOwnProperty(attributeKey)) {
        _$attributeNode.append(_attributes[attributeKey].get$node());
      }
    }

    this.setContextMenuItemCallback(function () {
      return {
        convertTo: {
          name: "Convert to..",
          items: {
            objectNode: {
              name: "..Object",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_ObjectNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipNode: {
              name: "..Relationship",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
            relationshipGroupNode: {
              name: "..Relationship Group",
              callback: function () {
                var canvas = that.getCanvas(),
                  appearance = that.getAppearance(),
                  nodeId;

                //noinspection JSAccessibilityCheck
                nodeId = canvas.createNode(
                  $__canvas_widget_RelationshipGroupNode.TYPE,
                  appearance.left,
                  appearance.top,
                  appearance.width,
                  appearance.height,
                  that.getZIndex(),
                  that.getContainment(),
                  that.toJSON()
                );
                var edges = that.getOutgoingEdges(),
                  edge,
                  edgeId;

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    canvas.createEdge(
                      edge.getType(),
                      nodeId,
                      edge.getTarget().getEntityId(),
                      edge.toJSON()
                    );
                  }
                }

                edges = that.getIngoingEdges();

                for (edgeId in edges) {
                  if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if (edge.getSource() !== edge.getTarget()) {
                      canvas.createEdge(
                        edge.getType(),
                        edge.getSource().getEntityId(),
                        nodeId,
                        edge.toJSON()
                      );
                    }
                  }
                }

                that.triggerDeletion();
              },
            },
          },
        },
        sep: "---------",
      };
    });
  }
}

export default AbstractClassNode;
