import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

export default function ImageCropper({ file, onCancel, onCrop }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // fungsi untuk hasilkan blob crop
    const getCroppedImage = async () => {
        const image = await createImage(URL.createObjectURL(file));
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height, x, y } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        canvas.toBlob((blob) => {
            onCrop(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg");
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        });

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 relative">
                <Cropper
                    image={URL.createObjectURL(file)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid={false}
                    className="w-[400px] h-[400px]"
                />
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={getCroppedImage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Crop
                    </button>
                </div>
            </div>
        </div>
    );
}
