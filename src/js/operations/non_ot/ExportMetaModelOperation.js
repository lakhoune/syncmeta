define([
    'operations/non_ot/NonOTOperation'
],/** @lends ExportMetaModelOperation */function(NonOTOperation) {

    ExportMetaModelOperation.TYPE = "ExportMetaModelOperation";

    /**
     * Export Image Operation
     * @class operations.non_ot.ExportMetaModelOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} requestingComponent Name of requesting Component
     * @param {string} data Meta model
     */
    function ExportMetaModelOperation(requestingComponent,data){
        /**
         * Name of requesting Component
         * @type {string}
         * @private
         */
        var _requestingComponent = requestingComponent;
        /**
         * Meta model
         * @type {object}
         * @private
         */
        var _data = data;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        /**
         * Get name of requesting Component
         * @returns {string}
         */
        this.getRequestingComponent = function(){
            return _requestingComponent;
        };

        /**
         * Get data URL of image
         * @returns {object}
         */
        this.getData = function(){
            return _data;
        };

        /**
         * Get exported JSON representation of the graph
         * @param {object} data
         */
        this.setData = function(data){
            _data = data;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(_nonOTOperation === null){
                _nonOTOperation = new NonOTOperation(
                    ExportMetaModelOperation.TYPE,
                    JSON.stringify({
                        requestingComponent: _requestingComponent,
                        data: _data
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    return ExportMetaModelOperation;

});