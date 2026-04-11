import { useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

export default function ColorPicker({value, onChange}: any) {
    const [color,setColor] = useState(value)

    useEffect(()=>{
        onChange(color)
    },[color])

    const pickColor = async () =>{
        if(!window.EyeDropper) {
            alert("このブラウザはEyeDropper APIに対応していません。")
            return
        }
        try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            setColor(result.sRGBHex);
        } catch (e) {
            console.error(e);
        }

    }
    return (
        <div className="space-y-3">
            <HexColorPicker color={color} onChange={setColor} />
            <div>
                {color}
            </div>
            <button
                onClick={pickColor}
                className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
                スポイト
            </button>
        </div>
    )
}