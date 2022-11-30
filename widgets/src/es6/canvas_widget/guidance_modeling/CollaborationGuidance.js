import { CONFIG } from "../../config";
import IWCW from "../../lib/IWCWrapper";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import _ from "lodash-es";
import CollaborateInActivityOperation from "../../operations/non_ot/CollaborateInActivityOperation";
import loadHTML from "../../html.template.loader";
const selectToolGuidanceHtml = await loadHTML(
  "../../../templates/guidance_modeling/collaboration_guidance.html",
  import.meta.url
);
function CollaborationGuidance(id, label, activityId, objectId, canvas) {
  var _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
  var _canvas = canvas;
  var _$node = $(
    _.template(selectToolGuidanceHtml)({ text: label, icon: "users" })
  );

  _$node.click(function () {
    var operation = new CollaborateInActivityOperation(activityId);
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.GUIDANCE,
      operation.toNonOTOperation()
    );
    _canvas.hideGuidanceBox();
    _canvas.scrollNodeIntoView(objectId);
  });

  this.get$node = function () {
    return _$node;
  };
}

export default CollaborationGuidance;
