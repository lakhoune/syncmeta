define([
    'operations/non_ot/NonOTOperation'
],/** @lends SetModelAttributeNodeOperation */function(NonOTOperation) {

    SetModelAttributeNodeOperation.TYPE = "SetModelAttributeNodeOperation";

    /**
     * SetModelAttributeNodeOperation
     * @class operations.non_ot.SetModelAttributeNodeOperation
     * @memberof operations.non_ot
     * @constructor
     */
    function SetModelAttributeNodeOperation(){
        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;


        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    SetModelAttributeNodeOperation.TYPE,
                    JSON.stringify({empty:'empty'})
                );
            }
            return nonOTOperation;
        };
    }

    return SetModelAttributeNodeOperation;

});
