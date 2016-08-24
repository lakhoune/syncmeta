define([
    'jqueryui'
],/** @lends Guidancemodel */function ($) {


    /**
     * Guidancemodel
     * @name Guidancemodel
     */
    function Guidancemodel(){
        var guidancemodeling = {};

        var deferred = $.Deferred();
        //Check whether this is the guidance modeling editor based on the activity name
        var act = openapp.param.get("http://purl.org/role/terms/activity");
        openapp.resource.get(act, function(resource){
            var activityName;
            console.info('Guidance promise by ' + frameElement.name);
            console.info(resource);
            try {
                if (resource.data)
                    activityName = resource.data[resource.uri]["http://purl.org/dc/terms/title"][0].value;
                else
                    activityName = "";
            }catch(e){
                console.info('Guidancemodel promise failed!');
            }
            guidancemodeling.INITIAL_NODE_LABEL = "Initial node";
            guidancemodeling.MERGE_NODE_LABEL = "Decision node";
            guidancemodeling.CALL_ACTIVITY_NODE_LABEL = "Call activity node";
            guidancemodeling.ACTIVITY_FINAL_NODE_LABEL = "Activity final node";
            guidancemodeling.CONCURRENCY_NODE_LABEL = "Fork node";

            guidancemodeling.isGuidanceEditor = function(){
                return activityName == "Guidance modeling";
            };

            guidancemodeling.getCreateObjectNodeLabelForType = function(type){
                return "Create " + type + " object";
            };

            guidancemodeling.isCreateObjectNodeLabel = function(label){
                var match = /Create (.*?) object/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getCreateRelationshipNodeLabelForType = function(type){
                return "Create " + type + " relationship";
            };

            guidancemodeling.isCreateRelationshipNodeLabel = function(label){
                var match = /Create (.*?) relationship/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getSetPropertyNodeLabelForType = function(type){
                return "Set property for " + type;
            };

            guidancemodeling.isSetPropertyNodeLabel = function(label){
                var match = /Set property for (.*)/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getEntityNodeLabelForType = function(type){
                return type + " entity";
            };

            guidancemodeling.isEntityNodeLabel = function(label){
                var match = /(.*?) entity/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getObjectContextLabelForType = function(type){
                return type + " Object Context";
            };

            guidancemodeling.getObjectTypeForObjectContextType = function(type){
                var i = type.lastIndexOf(" Object Context");
                return type.substring(0, i);
            };

            guidancemodeling.isObjectContextType = function(type){
                return type.indexOf(" Object Context", type.length - " Object Context".length) !== -1;
            };

            guidancemodeling.getRelationshipContextLabelForType = function(type){
                return type + " Relationship Context";
            };

            guidancemodeling.getRelationshipTypeForRelationshipContextType = function(type){
                var i = type.lastIndexOf(" Relationship Context");
                return type.substring(0, i);
            };

            guidancemodeling.isRelationshipContextType = function(type){
                return type.indexOf(" Relationship Context", type.length - " Relationship Context".length) !== -1;
            };

            guidancemodeling.getObjectToolLabelForType = function(type){
                return type + " Tool";
            };

            guidancemodeling.getObjectTypeForObjectToolType = function(type){
                var i = type.lastIndexOf(" Tool");
                return type.substring(0, i);
            };

            guidancemodeling.isObjectToolType = function(type){
                return type.indexOf(" Tool", type.length - " Tool".length) !== -1;
            };

            deferred.resolve(guidancemodeling);

        });
        return deferred.promise();

    }

    return Guidancemodel();
});