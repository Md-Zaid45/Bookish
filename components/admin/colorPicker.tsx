import { HexColorInput, HexColorPicker } from "react-colorful";

interface props{
  value:string, onPickerChnage:()=>void
}

const ColorPicker = ({ value, onPickerChnage }:props) => {
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
