import { useState } from "react";

export default function StepOne({ next, formData, setFormData }) {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const password = formData.password;
    const email = formData.email;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isLongEnough = password.length >= 8;
    const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isPasswordValid = isLongEnough && hasNumber && hasUpperLower; //bisa dipake klo mw error message password langsung ilang
    const isMatch = confirmPassword === password && confirmPassword !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        //cek klo blank
        if (
            email.trim() === "" ||
            password.trim() === "" ||
            confirmPassword.trim() === ""
        ) {
            return;
        }
        //cek udh valid datanya semua atau blm
        if (
            !isEmailValid ||
            !isLongEnough ||
            !hasUpperLower ||
            !hasNumber ||
            !isMatch
        ) {
            return;
        }
        next();
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
                <div className="bg-[#b491c8] rounded-2xl p-10 w-full max-w-md text-center shadow-xl">
                    <h1 className="text-2xl font-bold mb-2 text-black">
                        Sign Up
                    </h1>
                    <p className="text-sm text-gray-800 mb-6">
                        Kindly fill in this form to set up your ToGather account
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 text-left"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="text-white text-sm"
                            >
                                Email
                            </label>
                            <input
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        email: true,
                                    }))
                                }
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 rounded-md mt-1"
                                placeholder="Example@gmail.com"
                                required
                            />
                            {(touched.email || hasSubmitted) &&
                                email.trim() === "" && (
                                    <p className="text-sm text-red-600 font-semibold mt-1">
                                        ✖ Please fill in this field
                                    </p>
                                )}
                            {(touched.email || hasSubmitted) &&
                                !isEmailValid && (
                                    <p className="text-sm text-red-600 font-semibold mt-1">
                                        ✖ Please enter a valid email address
                                    </p>
                                )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="text-white text-sm"
                            >
                                Password
                            </label>
                            <input
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        password: true,
                                    }))
                                }
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-2 rounded-md mt-1 mb-1"
                                placeholder="Password"
                                required
                            />
                            {(touched.email || hasSubmitted) &&
                                password.trim() === "" && (
                                    <p className="text-sm text-red-600 font-semibold mt-1">
                                        ✖ Please fill in this field
                                    </p>
                                )}

                            {(touched.password || hasSubmitted) && (
                                <div className="text-sm space-y-1">
                                    <p
                                        className={`${
                                            isLongEnough
                                                ? "text-green-700"
                                                : "text-red-600"
                                        } font-semibold`}
                                    >
                                        {isLongEnough ? "✔" : "✖"} At least 8
                                        characters
                                    </p>
                                    <p
                                        className={`${
                                            hasUpperLower
                                                ? "text-green-700"
                                                : "text-red-600"
                                        } font-semibold`}
                                    >
                                        {hasUpperLower ? "✔" : "✖"} Upper &
                                        lowercase letters
                                    </p>
                                    <p
                                        className={`${
                                            hasNumber
                                                ? "text-green-700"
                                                : "text-red-600"
                                        } font-semibold`}
                                    >
                                        {hasNumber ? "✔" : "✖"} At least one
                                        number
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="text-white text-sm"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                onFocus={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        confirmPassword: true,
                                    }))
                                }
                                className="w-full p-2 rounded-md mt-1"
                                placeholder="Confirm Password"
                                required
                            />
                            {(touched.confirmPassword || hasSubmitted) &&
                                !isMatch && (
                                    <p className="text-sm text-red-600 font-semibold mt-1">
                                        ✖ Password mismatch
                                    </p>
                                )}
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-24 mt-4 relative">
                            {[1, 2, 3].map((n, index) => (
                                <div key={n} className="relative z-10">
                                    <div
                                        className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${
                                            n === 1
                                                ? "bg-[#5a4070] text-white"
                                                : "bg-white text-black"
                                        }`}
                                    >
                                        {n}
                                    </div>
                                    {index < 2 && (
                                        <div className="absolute top-1/2 left-full w-24 h-1 bg-white transform -translate-y-1/2 z-0" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#694c82] text-white py-2 mt-4 rounded-md hover:bg-[#5a4070]"
                        >
                            REGISTER
                        </button>
                    </form>
                    {/* Login Button */}
                    <p className="text-sm mt-4 text-white">
                        Already have an account yet?{" "}
                        <span className="font-semibold underline cursor-pointer">
                            Login {/*blm disambung kmn2*/}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
