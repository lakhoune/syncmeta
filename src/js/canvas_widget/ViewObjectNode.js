define([
    'require',
    'jqueryui',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/RenamingListAttribute',
    'canvas_widget/ConditionListAttribute',
    'canvas_widget/ViewTypesUtil',
    'canvas_widget/LogicalOperator',
    'canvas_widget/LogicalConjunctions',
    'text!templates/canvas_widget/viewobject_node.html'
],/** @lends ViewObjectNode */function(require,$,_,AbstractNode,SingleSelectionAttribute,RenamingListAttribute,ConditionListAttribute,ViewTypesUtil,LogicalOperator,LogicalConjunctions,viewobjectNodeHtml) {

    ViewObjectNode.TYPE = "ViewObject";
    ViewObjectNode.DEFAULT_WIDTH = 150;
    ViewObjectNode.DEFAULT_HEIGHT = 100;

    ViewObjectNode.prototype = new AbstractNode();
    ViewObjectNode.prototype.constructor = ViewObjectNode;
    /**
     * ViewObjectNode
     * @class canvas_widget.ViewObjectNode
     * @extends canvas_widget.AbstractNode
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     * @param {object} jsonFromResource the ViewObjectNode is created from a json
     */
    function ViewObjectNode(id,left,top,width,height,zIndex, jsonFromResource){
        var that = this;

        var _fromResource = jsonFromResource;

        AbstractNode.call(this,id,ViewObjectNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(viewobjectNodeHtml,{type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("viewobject");

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
        this.toJSON = function(){
            return AbstractNode.prototype.toJSON.call(this);
        };

        var attributeList = new RenamingListAttribute("[attributes]","Attributes",this,{"show":"Visible","hide":"Hidden"});
        this.addAttribute(attributeList);


        var registerYTextAttributes = function(map){
            map.get(that.getLabel().getValue().getEntityId()).then(function(ytext){
                that.getLabel().getValue().registerYType(ytext);
            });
        };
        this.registerYMap = function(map, disableYText){
            AbstractNode.prototype.registerYMap.call(this,map);
            if(!disableYText)
                registerYTextAttributes(map);
            attributeList.registerYMap(disableYText);
            if(cla)
                cla.registerYMap(disableYText);
            attribute.getValue().registerYType();
            conjSelection.getValue().registerYType();
        };

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

        //ViewTypesUtil.GetCurrentBaseModel().then(function(model){
        var model = y.share.data.get('model');
        var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes,['Object']);
        var attribute = new SingleSelectionAttribute(id+"[target]", "Target", that, selectionValues);

        var conjSelection = new SingleSelectionAttribute(id+'[conjunction]', 'Conjunction', that, LogicalConjunctions);

        var cla = null;
        that.addAttribute(conjSelection);

        that.get$node().find('.attributes').append(conjSelection.get$node());

        if(_fromResource){
            var targetId;
            var target = _fromResource.attributes[id + '[target]'];
            if(target)
                targetId = target.value.value;

            if(targetId){
                attribute.setValueFromJSON(_fromResource.attributes[id + '[target]']);
                if(conditonList = _fromResource.attributes["[condition]"]){
                    var attrList = _fromResource.attributes['[attributes]'].list;
                    var targetAttrList = {};
                    for (var key in attrList) {
                        if (attrList.hasOwnProperty(key)) {
                            targetAttrList[key] = attrList[key].val.value;
                        }
                    }
                    cla = new ConditionListAttribute("[condition]", "Conditions", that, targetAttrList, LogicalOperator, LogicalConjunctions);

                    //cla.setValueFromJSON(conditonList);
                    that.addAttribute(cla);

                    that.get$node().find('.attributes').append(cla.get$node());
                }
            }
            _fromResource = null;
        }
        that.addAttribute(attribute);

        that.get$node().find('.attributes').prepend(attribute.get$node());

        //});

        this.setContextMenuItemCallback(function(){
            var NodeShapeNode = require('canvas_widget/NodeShapeNode'),
                BiDirAssociationEdge = require('canvas_widget/BiDirAssociationEdge'),
                UniDirAssociationEdge = require('canvas_widget/UniDirAssociationEdge');
            var viewId = $('#lblCurrentView').text();
            return {
                addShape: {
                    name: "Add Node Shape",
                    callback: function(){
                        var canvas = that.getCanvas(),
                            appearance = that.getAppearance(),
                            nodeId;

                        //noinspection JSAccessibilityCheck
                        canvas.createNode(NodeShapeNode.TYPE,appearance.left + appearance.width + 50,appearance.top,150,100).done(function(nodeId){
                            canvas.createEdge(BiDirAssociationEdge.TYPE,that.getEntityId(),nodeId, null, null, viewId);
                        });
                    },
                    disabled: function() {
                        var edges = that.getEdges(),
                            edge,
                            edgeId;

                        for(edgeId in edges){
                            if(edges.hasOwnProperty(edgeId)){
                                edge = edges[edgeId];
                                if( (edge instanceof BiDirAssociationEdge &&
                                    (edge.getTarget() === that && edge.getSource() instanceof NodeShapeNode ||
                                    edge.getSource() === that && edge.getTarget() instanceof NodeShapeNode)) ||

                                    (edge instanceof UniDirAssociationEdge && edge.getTarget() instanceof NodeShapeNode) ){

                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                },
                sep: "---------"
            };
        });

    }

    return ViewObjectNode;

});