export interface Theme {
  id: string;
  name: string;

  colors: {
    background?: string;
    backgroundImages?: string[];
    heading: string;
    paragraph: string;
  };

  fonts: {
    heading: string;
    paragraph: string;
  };
}

export interface SlideBlock {
  id: string;
  type: string;
  text?: string;
  items?: string[];
  url?: string;
  language?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  chart?: {
    type:
      | "bar"
      | "line"
      | "pie"
      | "doughnut"
      | "radar"
      | "polarArea"
      | "scatter";
    labels: string[];
    values: number[];
    title?: string;
    colors?: string[];
  };
  widthPercent?: number;
  heightPercent?: number;

  xPercent?: number;
  yPercent?: number;

  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    lineHeight?: number;
    color?: string;
  };

  justifyContent?: "flex-start" | "flex-end";
}

export interface PlateSlide {
  id: string;
  title: string;
  layout?:
    | "left-image"
    | "right-image"
    | "center"
    | "text-only"
    | "top-image"
    | "bottom-image";
  content: SlideBlock[];
  alignItems?: "flex-start" | "flex-end" | "center";
  theme?: Theme;
  markdownText: string;
}
