import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function MiniEditor({ value, onChange }) {
    const modules = {
        toolbar: [
            ["bold", "italic", "underline"], // ONLY B I U
        ],
    };

    const formats = ["bold", "italic", "underline"];

    return (
        <div className="bg-white border rounded-md p-2">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                style={{
                    minHeight: "120px",
                }}
            />
        </div>
    );
}
