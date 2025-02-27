export default function () {
  var createReloadHandler = function () {
    var iwcClient = window._iwc_instance_;
    var intent_listener: any[] = [];
    if (iwcClient && iwcClient.onIntent != null) {
      var previous_iwc_onIntent = iwcClient.onIntent;
      iwcClient.onIntent = function (message: any) {
        if (message.action === "RELOAD") {
          console.log(
            " K!!!!!!!!!!!!!!!!!!!!!!!!!!!! RELOAD!!!!!!!!!!!!!!!!!!!!!"
          );
          window.location.reload();
        } else {
          for (var i = 0; i < intent_listener.length; i++) {
            intent_listener[i].apply(this, arguments);
          }
        }
        previous_iwc_onIntent.apply(this, arguments);
      };
      window._addIwcIntentListener = function (f) {
        intent_listener.push(f);
      };
      window._reloadThisFuckingInstance = function () {
        console.log("Reloading Everything");
        var message = {
          action: "RELOAD",
          component: "",
          data: "",
          dataType: "",
          flags: ["PUBLISH_GLOBAL"],
          extras: {
            reload: true,
          },
        };
        iwcClient.publish(message);
      };
    } else {
      setTimeout(createReloadHandler, 5000);
    }
  };
  setTimeout(createReloadHandler, 10000);
}
