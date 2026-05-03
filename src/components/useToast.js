import { useState } from "react";

export default function useToast() {
  var [toasts, setToasts] = useState([]);

  function show(msg, type) {
    if (!type) type = "info";
    var id = Date.now();
    setToasts(function (prev) {
      return [...prev, { id: id, msg: msg, type: type }];
    });
    setTimeout(function () {
      setToasts(function (prev) {
        return prev.filter(function (t) {
          return t.id !== id;
        });
      });
    }, 3500);
  }

  return { toasts: toasts, show: show };
}
