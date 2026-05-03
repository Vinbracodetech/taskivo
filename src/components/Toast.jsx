export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(function (t) {
        return (
          <div key={t.id} className={"toast " + t.type}>
            <span>
              {t.type === "success" && "✓"}
              {t.type === "error" && "✕"}
              {t.type === "warning" && "⚠"}
              {t.type === "info" && "ℹ"}
            </span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}
