let contextId = -1;
let isAltGrPressed = false;

const keyMap = {
  "KeyO": "ö",
  "KeyW": "ŵ"
};

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
  isAltGrPressed = false;
});

chrome.input.ime.onBlur.addListener((context) => {
  if (contextId === context.contextID) {
    contextId = -1;
  }
  isAltGrPressed = false;
});

chrome.input.ime.onDeactivated.addListener(() => {
  isAltGrPressed = false;
  contextId = -1;
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  
  if (keyData.code === "AltRight") {
    if (keyData.type === "keydown") {
      isAltGrPressed = true;
    } else if (keyData.type === "keyup") {
      isAltGrPressed = false;
    }
    return false;
  }

  if (keyData.type === "keydown" && isAltGrPressed) {
    
    const charToInsert = keyMap[keyData.code];

    if (charToInsert && contextId !== -1) {
      chrome.input.ime.commitText({
        "contextID": contextId,
        "text": charToInsert
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error committing text:", chrome.runtime.lastError.message);
        }
      });
      
      return true;
    }
  }

  return false;
});

