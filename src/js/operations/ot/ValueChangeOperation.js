define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends ValueChangeOperation */function(require,EntityOperation,OTOperation) {

    ValueChangeOperation.TYPE = "ValueChangeOperation";
    ValueChangeOperation.prototype = new EntityOperation();
	ValueChangeOperation.prototype.constructor = ValueChangeOperation;
    /**
     * ValueChangeOperation
     * @class operations.ot.ValueChangeOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param entityId Entity id of the entity this activity works on
     * @param {string} value Char that has been added resp. deleted
     * @param {string} type Type of operation (insertion resp. deletion)
     * @param {number} position Position where the char has been added resp. deleted
     * @constructor
     */
    function ValueChangeOperation(entityId,value,type,position, fromView){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.ValueChangeOperation,entityId,CONFIG.ENTITY.VAL);

        var _fromView = fromView;

        /**
         * Char that has been added resp. deleted
         * @type {string}
         * @private
         */
        var _value = value;

        /**
         * Type of operation (insertion resp. deletion)
         * @type {string}
         * @private
         */
        var _type = type;

        /**
         * Position where the char has been added resp. deleted
         * @type {number}
         * @private
         */
        var _position = position;

        /**
         * Is the change issued by a remote user
         * @type {boolean}
         * @private
         */
        var _remote = true;

        /**
         * Chain of entities the value is assigned to
         * @type {string[]}
         * @private
         */
        var _entityIdChain = [];

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.VAL+":"+that.getEntityId(),
                _value,
                _type,
                _position,
                _fromView
            );
        };

        this.getFromView = function(){
          return _fromView;
        };

        this.setFromView = function(fromView){
          _fromView = fromView;
        };
        /**
         * Get char that has been added resp. deleted
         * @returns {string}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * Get type of operation (insertion resp. deletion)
         * @returns {string}
         */
        this.getType = function(){
            return _type;
        };

        /**
         * Set type of operation (insertion resp. deletion)
         * @param position
         */
        this.setPosition = function(position){
            _position = position;
        };

        /**
         * Get position where the char has been added resp. deleted
         * @returns {number}
         */
        this.getPosition = function(){
            return _position;
        };

        /**
         * Set if the change is issued by a remote user
         * @param remote
         */
        this.setRemote = function(remote){
            _remote = remote;
        };

        /**
         * Get if the change is issued by a remote user
         * @returns {boolean}
         */
        this.getRemote = function(){
            return _remote;
        };

        /**
         * Set chain of entities the value is assigned to
         * @param {string[]} entityIdChain
         */
        this.setEntityIdChain = function(entityIdChain){
            _entityIdChain = entityIdChain;
        };

        /**
         * Get chain of entities the value is assigned to
         * @returns {string[]}
         */
        this.getEntityIdChain = function(){
            return _entityIdChain;
        };

        /**
         * Get topmost entity in the chain of entity the value is assigned to
         * @returns {string}
         */
        this.getRootSubjectEntityId = function(){
            return _entityIdChain[0];
        };

        /**
         * Get corresponding ot operation
         * @returns {operations.ot.OTOperation}
         * @private
         */
        this.getOTOperation = function(){
            var otOperation = EntityOperation.prototype.getOTOperation.call(this);
            if(otOperation === null){
                otOperation = createOTOperation();
                this.setOTOperation(otOperation);
            }
            return otOperation;
        };

        /**
         * Adjust the passed operation in the history of operation
         * when this operation is applied remotely after the passed operation
         * on an graph instance stored in the passed EntityManager
         * @param {canvas_widget.EntityManager} EntityManager
         * @param {operations.ot.EntityOperation} operation Remote operation
         * @returns {operations.ot.EntityOperation}
         */
        this.adjust = function(EntityManager,operation){
            switch(operation.getOperationType()){
                case EntityOperation.TYPES.ValueChangeOperation:
                    if(this.getEntityId() === operation.getEntityId()){
                        if(this.getPosition() === operation.getPosition &&
                            this.getValue() === operation.getValue &&
                            (this.getType() === CONFIG.OPERATION.TYPE.INSERT && operation.getType() === CONFIG.OPERATION.TYPE.DELETE) ||
                            (this.getType() === CONFIG.OPERATION.TYPE.DELETE && operation.getType() === CONFIG.OPERATION.TYPE.INSERT) ){
                            return null;
                        }
                        if(this.getPosition() <= operation.getPosition()){
                            switch(this.getType()){
                                case CONFIG.OPERATION.TYPE.INSERT:
                                    operation.setPosition(operation.getPosition()+1);
                                    break;
                                case CONFIG.OPERATION.TYPE.DELETE:
                                    operation.setPosition(operation.getPosition()-1);
                                    break;
                            }
                        }
                    }
                    break;
            }

            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {ValueChangeOperation}
         */
        this.inverse = function(){
            var newType,
                ValueChangeOperation = require('operations/ot/ValueChangeOperation');

            switch (this.getType()){
                case CONFIG.OPERATION.TYPE.INSERT:
                    newType = CONFIG.OPERATION.TYPE.DELETE;
                    break;
                case CONFIG.OPERATION.TYPE.DELETE:
                    newType = CONFIG.OPERATION.TYPE.INSERT;
                    break;
                case CONFIG.OPERATION.TYPE.UPDATE:
                    newType = CONFIG.OPERATION.TYPE.UPDATE;
                    break;
            }
            return new ValueChangeOperation(
                this.getEntityId(),
                this.getValue(),
                newType,
                this.getPosition()
            );
        };
    }

    ValueChangeOperation.getOperationDescription = function(valueKey,entityType,entityName,viewId){
        if(!viewId)
            return ".. changed " + valueKey + " of " + entityType + (entityName ? " " : "") + entityName;
        else
            return ".. changed " + valueKey + " of " + entityType + (entityName ? " " : "") + entityName + " in View " + viewId;
    };

    ValueChangeOperation.prototype.toJSON = function(){
        return {
            entityId : this.getEntityId(),
            value: this.getValue(),
            position: this.getPosition(),
            type : this.getType()

        }
    };

    return ValueChangeOperation;

});