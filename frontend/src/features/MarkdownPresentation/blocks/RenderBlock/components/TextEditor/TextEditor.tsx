import React, { useState } from "react";
import { InputBase, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../app/store";
import { SlideBlock, Theme } from "../../../../../../shared/types";

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  minRows?: number;
  block?: SlideBlock;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  onBlur,
  minRows = 1,
  block,
}) => {
  const [focused, setFocused] = useState(false);
  const theme: Theme | undefined = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  const color = block?.style?.color;
  const fontSize = block?.style?.fontSize;
  const fontWeight = block?.style?.fontWeight;
  const fontFamily = block?.style?.fontFamily;

  return (
    <InputBase
      multiline
      minRows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      sx={{
        width: "100%",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        border: focused
          ? `1px solid ${theme?.colors.paragraph}`
          : "1px solid transparent",
        transition: "border 0.2s, box-shadow 0.2s",
        boxShadow: focused ? "0 0 5px rgba(89, 122, 211, 0.5)" : "none",
      }}
    />
  );
};

export default TextEditor;
