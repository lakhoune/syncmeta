define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/IntegerAttribute',
    'canvas_widget/FileAttribute',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/SingleValueAttribute'
],/** @lends makeNode */function($,jsPlumb,_,AbstractNode,BooleanAttribute,IntegerAttribute,FileAttribute,SingleSelectionAttribute,SingleValueAttribute) {

    /**
     * Node
     * @class canvas_widget.makeNode
     * @memberof canvas_widget
     * @constructor
     * @param type Type of node
     * @param $shape
     * @param anchors
     * @param attributes
     * @returns {Node}
     */
    function makeNode(type,$shape,anchors,attributes, jsplumb){

        Node.prototype = new AbstractNode();
        Node.prototype.constructor = Node;

        /**
         * Node
         * @class canvas_widget.Node
         * @extends canvas_widget.AbstractNode
         * @constructor
         * @param {string} id Entity identifier of node
         * @param {number} left x-coordinate of node position
         * @param {number} top y-coordinate of node position
         * @param {number} width Width of node
         * @param {number} height Height of node
         * @param {number} zIndex Position of node on z-axis
         */
        function Node(id,left,top,width,height,zIndex){
            var that = this;

            AbstractNode.call(this,id,type,left,top,width,height,zIndex);

            /**
             * jQuery object of node template
             * @type {jQuery}
             * @private
             */
            var _$template = $shape.clone();

            /**
             * jQuery object of DOM node representing the node
             * @type {jQuery}
             * @private
             */
            var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

            /**
             * Options for new connections
             * @type {object}
             */
            var _anchorOptions = anchors;

            var init = function(){
                var attribute, attributeId, attrObj;
                attrObj = {};
                for(attributeId in attributes){
                    if(attributes.hasOwnProperty(attributeId)){
                        attribute = attributes[attributeId];
                        var key = attribute.key.toLowerCase();
                        switch(attribute.value){
                            case "boolean":
                                attrObj[attributeId] = new BooleanAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            case "string":
                                attrObj[attributeId] = new SingleValueAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                //TODO: Add option to set identifier attribute in metamodel
                                if(attribute.key.toLowerCase() === 'label' || attribute.key.toLowerCase() === 'title' || attribute.key.toLowerCase() === "name"){
                                    that.setLabel(attrObj[attributeId]);
                                }
                                break;
                            case "integer":
                                attrObj[attributeId] = new IntegerAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            case "file":
                                attrObj[attributeId] = new FileAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that);
                                break;
                            default:
                                if(attribute.options){
                                    attrObj[attributeId] = new SingleSelectionAttribute(id+"["+attribute.key.toLowerCase()+"]",attribute.key,that,attribute.options);
                                }
                        }
                        _$node.find("."+key).append(attrObj[attributeId].get$node());
                    }
                }
                that.setAttributes(attrObj);

            };

            /**
             * Get anchor options for new connections
             * @returns {Object}
             */
            this.getAnchorOptions = function(){
                return _anchorOptions;
            };

            /**
             * Bind source node events for edge tool
             */
            this.makeSource = function(){
                _$node.addClass("source");
                jsPlumb.makeSource(_$node,{
                    connectorPaintStyle:{ strokeStyle:"#aaaaaa", lineWidth:2 },
                    endpoint: "Blank",
                    anchor: _anchorOptions,
                    //maxConnections:1,
                    uniqueEndpoint:false,
                    deleteEndpointsOnDetach:true,
                    onMaxConnections:function(info/*, originalEvent*/) {
                        console.log("element is ", info.element, "maxConnections is", info.maxConnections);
                    }
                });

                if(jsplumb)
                    jsPlumb.addEndpoint(_$node, jsplumb.endpoint, {uuid: id + "_eps1"});
            };

            /**
             * Bind target node events for edge tool
             */
            this.makeTarget = function(){
                _$node.addClass("target");
                jsPlumb.makeTarget(_$node,{
                    isTarget:false,
                    uniqueEndpoint:false,
                    endpoint: "Blank",
                    anchor: _anchorOptions,
                    //maxConnections:1,
                    deleteEndpointsOnDetach:true,
                    onMaxConnections:function(info/*, originalEvent*/) {
                        console.log("user tried to drop connection", info.connection, "on element", info.element, "with max connections", info.maxConnections);
                    }
                });

                if(jsplumb)
                    jsPlumb.addEndpoint(_$node, jsplumb.endpoint, {uuid: id + "_ept1"});
            };

            /**
             * Unbind events for edge tool
             */
            this.unbindEdgeToolEvents = function(){
                _$node.removeClass("source target");
                jsPlumb.unmakeSource(_$node);
                jsPlumb.unmakeTarget(_$node);
            };

            /**
             * Get JSON representation of the node
             * @returns {Object}
             */
            this.toJSON = function(){
                var json = AbstractNode.prototype.toJSON.call(this);
                json.type = type;
                return json;
            };

            this.get$node = function(){
                return _$node;
            };

            init();
        }
        return Node;
    }

    return makeNode;

});