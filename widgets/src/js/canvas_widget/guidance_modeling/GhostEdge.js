define([
'jqueryui',
'jsplumb',
'lodash',
'text!templates/guidance_modeling/ghost_edge.html',
'bootstrap'
],function($, jsPlumb, _, ghostEdgeHtml) {
    function GhostEdge(canvas, edgeFunction, source, target){
        var _jsPlumbConnection = null;
        var _label = edgeFunction.getType();
        var _canvas = canvas;
        var that = this;

        source.addGhostEdge(this);
        target.addGhostEdge(this);
    
        this.getLabel = function(){
            return _label;
        };
        
        this.connect = function(button){
            if(_jsPlumbConnection)
                return;
            var overlays = edgeFunction.getArrowOverlays();
            overlays.push(["Custom", {
                create:function(component) {
                    return $("<div></div>").append(button);                
                },
                location:0.5,
                id:"customOverlay",
                cssClass: "ghost-edge-overlay"
            }]);
            var connectOptions = {
                source: source.get$node(),
                target: target.get$node(),
                paintStyle:{
                    strokeStyle: edgeFunction.getColor(),
                    lineWidth: 2,
                    dashstyle: ""
                },
                endpoint: "Blank",
                anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                connector: edgeFunction.getShape(),
                overlays: overlays,
                cssClass: "ghost-edge"
            };

            if(source === target){
                connectOptions.anchors = ["TopCenter","LeftMiddle"];
            }

            _jsPlumbConnection = jsPlumb.connect(connectOptions);
            _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        this.remove = function(){
            if(_jsPlumbConnection)
                jsPlumb.detach(_jsPlumbConnection);
            _jsPlumbConnection = null;
        };

        this.getEdgeFunction = function(){
            return edgeFunction;
        };

        this.getSource = function(){
            return source;
        };

        this.getTarget = function(){
            return target;
        }; 
    }

    return GhostEdge;

});