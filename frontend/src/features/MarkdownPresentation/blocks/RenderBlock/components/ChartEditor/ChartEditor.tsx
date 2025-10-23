import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChartBlock from "../ChartBlock";
import { SlideBlock } from "../../../../../../shared/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../app/store";
import { themes } from "../../../../../../shared/constants";

interface ChartEditorProps {
  open: boolean;
  initialChart: NonNullable<SlideBlock["chart"]>;
  onSave: (chart: NonNullable<SlideBlock["chart"]>) => void;
  onCancel: () => void;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({
  open,
  initialChart,
  onSave,
  onCancel,
}) => {
  const [chart, setChart] = React.useState({ ...initialChart });

  const theme = useSelector((state: RootState) =>
    state.editor.availableThemes.find(
      (t) => t.id === state.editor.globalThemeId
    )
  );

  React.useEffect(() => {
    setChart({ ...initialChart });
  }, [initialChart]);

  const updateLabel = (idx: number, value: string) => {
    setChart((c) => ({
      ...c,
      labels: c.labels.map((l, i) => (i === idx ? value : l)),
    }));
  };

  const updateValue = (idx: number, value: number) => {
    setChart((c) => ({
      ...c,
      values: c.values.map((v, i) => (i === idx ? value : v)),
    }));
  };

  const addDataPoint = () => {
    setChart((c) => ({
      ...c,
      labels: [...c.labels, `Label ${c.labels.length + 1}`],
      values: [...c.values, 0],
      colors: Array.isArray(c.colors) ? [...c.colors, "#4bc0c0"] : c.colors,
    }));
  };

  const removeDataPoint = (idx: number) => {
    setChart((c) => ({
      ...c,
      labels: c.labels.filter((_, i) => i !== idx),
      values: c.values.filter((_, i) => i !== idx),
      colors: Array.isArray(c.colors)
        ? c.colors.filter((_, i) => i !== idx)
        : c.colors,
    }));
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Редактор графика
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            select
            label="Тип графика"
            value={chart.type}
            onChange={(e) =>
              setChart((c) => ({
                ...c,
                type: e.target.value as "bar" | "line" | "pie",
              }))
            }
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
            <MenuItem value="doughnut">Doughnut</MenuItem>
            <MenuItem value="radar">Radar</MenuItem>
            <MenuItem value="polarArea">Polar Area</MenuItem>
            <MenuItem value="scatter">Scatter</MenuItem>
          </TextField>

          <TextField
            label="Заголовок"
            value={chart.title || ""}
            onChange={(e) => setChart((c) => ({ ...c, title: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />

          {chart.labels.map((label, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Label"
                value={label}
                onChange={(e) => updateLabel(idx, e.target.value)}
                size="small"
              />
              <TextField
                label="Value"
                type="number"
                value={chart.values[idx]}
                onChange={(e) => updateValue(idx, Number(e.target.value))}
                size="small"
              />
              <Button color="error" onClick={() => removeDataPoint(idx)}>
                Удалить
              </Button>
            </Box>
          ))}

          <Button onClick={addDataPoint}>Добавить точку</Button>

          <Box sx={{ mt: 4, border: "1px solid #ddd", p: 2 }}>
            <ChartBlock chart={chart} theme={theme ?? themes[0]} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button variant="contained" onClick={() => onSave(chart)}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
