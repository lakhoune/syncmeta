import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import AbstractAttribute from "./AbstractAttribute";
import IntegerValue from "./IntegerValue";
import loadHTML from "../html.template.loader";

const integerAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/integer_attribute.html",
  import.meta.url
);

IntegerAttribute.prototype = new AbstractAttribute();
IntegerAttribute.prototype.constructor = IntegerAttribute;
/**
 * IntegerAttribute
 * @class attribute_widget.IntegerAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractAttribute
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
 * @param {Object} options Selection options as key value object
 */
function IntegerAttribute(id, name, subjectEntity, options) {
  AbstractAttribute.call(this, id, name, subjectEntity);

  /***
   * Value object of value
   * @type {attribute_widget.IntegerValue}
   * @private
   */
  var _value = new IntegerValue(
    id,
    name,
    this,
    this.getRootSubjectEntity(),
    options
  );

  /**
   * jQuery object of DOM node representing the node
   * @type {jQuery}
   * @private
   */
  var _$node = $(_.template(integerAttributeHtml)());

  /**
   * Set Value object of value
   * @param {attribute_widget.IntegerValue} value
   */
  this.setValue = function (value) {
    _value = value;
  };

  /**
   * Get Value object of value
   * @return {attribute_widget.IntegerValue} value
   */
  this.getValue = function () {
    return _value;
  };

  /**
   * jQuery object of DOM node representing the attribute
   * @type {jQuery}
   * @private
   */
  this.get$node = function () {
    return _$node;
  };

  /**
   * Set attribute value by its JSON representation
   * @param {Object} json
   */
  this.setValueFromJSON = function (json) {
    _value.setValueFromJSON(json.value);
  };

  _$node.find(".name").text(this.getName());
  _$node.find(".value").append(_value.get$node());

  // check if view only mode is enabled for the property browser
  // because then the input fields should be disabled
  if (window.hasOwnProperty("y")) {
    const widgetConfigMap = y.getMap("widgetConfig");
    if (widgetConfigMap.get("view_only_property_browser")) {
      _$node.find(".val").attr("disabled", "true");
    }
  }
}

export default IntegerAttribute;
