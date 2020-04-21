define([
    'operations/non_ot/NonOTOperation'
],/** @lends UpdateViewListOperation */function(NonOTOperation) {

    UpdateViewListOperation.TYPE = "UpdateViewListOperation";

    /**
     * UpdateViewListOperation
     * @class operations.non_ot.UpdateViewListOperation
     * @memberof operations.non_ot
     * @constructor
     */
    function UpdateViewListOperation(){
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
                    UpdateViewListOperation.TYPE,
                    JSON.stringify({})
                );
            }
            return nonOTOperation;
        };
    }

    return UpdateViewListOperation;

});
