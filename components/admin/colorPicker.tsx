import { HexColorInput, HexColorPicker } from "react-colorful";

const ColorPicker = ({ value, onPickerChnage }) => {
  return (
    <div className="flex-col ">
      <div className="flex items-baseline">
        <p className="hex-input">#</p>
        <HexColorInput color={value} className="hex-input" />
      </div>

      <HexColorPicker
        color={value}
        onChange={onPickerChnage}
        className="hex-color-picker"
      />
    </div>
  );
};

export default ColorPicker;
