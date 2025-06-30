import { useState, useEffect, useRef } from "react";

export default function StepTwo({ next, formData, setFormData }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(59);
    const inputsRef = useRef([]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const joined = otp.join("");
        if (joined.length === 6) {
            setFormData({ ...formData, number: joined });
            next();
        }
    };

    return (
        <div className="flex min-h-screen w-screen">
            {/* Bg Kiri */}
            <div
                className="w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/backgroundImg/bg_purple_registerPage.jpg')",
                }}
            />
            {/* Bg Kanan */}
            <div className="w-1/2 bg-white" />

            {/* Form */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#b491c8] rounded-2xl p-10 w-[448px] h-[540px] text-center shadow-xl flex flex-col justify-between">
                    <h1 className="text-2xl font-bold mb-6 text-black">
                        OTP Authentication
                    </h1>
                    <p className="text-sm text-gray-800 mb-6">
                        Please enter the 6 digit one time code
                        <br />
                        we have sent to &lt;{formData.email}&gt;
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* OTP Input */}
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) =>
                                        (inputsRef.current[index] = el)
                                    }
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    className="w-10 h-12 text-center text-lg rounded-md border border-black bg-white"
                                />
                            ))}
                        </div>

                        {/* Resend Timer */}
                        <p className="text-sm text-white mt-4">
                            Didn’t receive OTP?{" "}
                            {timer > 0 ? (
                                <span className="font-semibold">
                                    Resend again in{" "}
                                    <span className="text-white">
                                        00:{timer.toString().padStart(2, "0")}
                                    </span>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setTimer(60)}
                                    className="font-semibold underline text-white hover:text-blue-200"
                                >
                                    Resend
                                </button>
                            )}
                        </p>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-24 mt-6 relative">
                            {[1, 2, 3].map((n, index) => (
                                <div key={n} className="relative z-10">
                                    <div
                                        className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${
                                            n <= 2
                                                ? "bg-[#5a4070] text-white"
                                                : "bg-white text-black"
                                        }`}
                                    >
                                        {n}
                                    </div>
                                    {index < 1 && (
                                        <div className="absolute top-1/2 left-full w-24 h-1 bg-[#5a4070] transform -translate-y-1/2 z-0" />
                                    )}
                                    {index < 2 && (
                                        <div
                                            className={`absolute top-1/2 left-full w-24 h-1 transform -translate-y-1/2 z-0 ${
                                                n === 2
                                                    ? "bg-white"
                                                    : "bg-[#5a4070]"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#694c82] text-white py-2 mt-4 rounded-md hover:bg-[#5a4070]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
