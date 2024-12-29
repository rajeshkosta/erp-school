import { useEffect } from "react";
import { shortcutsTobeBlocked } from "../Const/Constant";

const ScreenshotRestrictor = ({ children }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("hello", event.keyCode);
      const isBlocked = shortcutsTobeBlocked?.some((shortcut) =>
        shortcut?.every((key) => {
          if (typeof key === "string") {
            return event[key];
          } else if (typeof key === "object" && "keyCode" in key) {
            return event.keyCode === key.keyCode;
          }
        })
      );

      if (isBlocked) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    navigator.clipboard
      .readText()
      .then((text) => {
        console.log("Pasted content: ", text);
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcutsTobeBlocked]);

  return children;
};

export default ScreenshotRestrictor;
