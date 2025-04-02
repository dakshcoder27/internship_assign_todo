export const applyFormatting = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

export const formatText = (type: string) => {
  switch (type) {
    case "bold":
      applyFormatting("bold");
      break;
    case "italic":
      applyFormatting("italic");
      break;
    case "underline":
      applyFormatting("underline");
      break;
    case "justifyLeft":
      applyFormatting("justifyLeft");
      break;
    case "justifyCenter":
      applyFormatting("justifyCenter");
      break;
    case "justifyRight":
      applyFormatting("justifyRight");
      break;
    case "justifyFull":
      applyFormatting("justifyFull");
      break;
    case "insertUnorderedList":
      applyFormatting("insertUnorderedList");
      break;
    case "insertOrderedList":
      applyFormatting("insertOrderedList");
      break;
    default:
      break;
  }
};

export const setFontSize = (size: string) => {
  applyFormatting("fontSize", size);
};

export const setTextColor = (color: string) => {
  applyFormatting("foreColor", color);
};

export const setBackgroundColor = (color: string) => {
  applyFormatting("hiliteColor", color);
};
