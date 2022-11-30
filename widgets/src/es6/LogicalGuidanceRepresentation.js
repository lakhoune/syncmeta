import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";

const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());

/**
 * LogicalGuidanceRepresentation
 * @name LogicalGuidanceRepresentation
 */
function LogicalGuidanceRepresentation() {
  var deferred = $.Deferred();
  resourceSpace.getSubResources({
    relation: openapp.ns.role + "data",
    type: CONFIG.NS.MY.LOGICALGUIDANCEREPRESENTATION,
    onAll: function (data) {
      if (data === null || data.length === 0) {
        deferred.resolve({});
      } else {
        data[0].getRepresentation("rdfjson", function (representation) {
          deferred.resolve(representation);
        });
      }
    },
  });

  return deferred.promise();
}

export default LogicalGuidanceRepresentation();
