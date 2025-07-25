export default function Loading({ 
  message = "Loading...", 
  size = "normal",
  fullScreen = false 
}) {
  const spinnerClass = size === "small" ? "spinner-border-sm" : 
                      size === "large" ? "fs-3" : "";
  
  const content = (
    <div className="text-center">
      <div className={`spinner-clean mx-auto mb-3 ${spinnerClass}`}></div>
      <p className="text-muted">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        {content}
      </div>
    );
  }

  return content;
}
