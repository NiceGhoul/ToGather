import { Inertia } from "@inertiajs/inertia";
import React, { useState, useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Layout_Register from "../../Layouts/Layout_Register";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function Register() {
    //State buat step-step di form (1: Email, Password, Confirm Password, 2: OTP, 3: Fullname, Nickname, Address)
    const [step, setStep] = useState(1);

    //Ref untuk input OTP (6 digit)
    const otpRefs = Array.from({ length: 6 }, () => useRef(null));

    //Ref untuk input field lain (biar auto focus)
    const emailRef = useRef(null);
    const fullNameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const nicknameRef = useRef(null);
    const addressRef = useRef(null);

    //State untuk data form
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        nickname: "",
        address: "",
        otp: "",
    });

    //State untuk error validasi
    const [errors, setErrors] = useState({});

    //State untuk menandai field yang sudah disentuh
    const [touched, setTouched] = useState({});

    //State untuk timer OTP
    const [otpTimer, setOtpTimer] = useState(60);
    const [isCounting, setIsCounting] = useState(true);

    //Efek countdown timer OTP
    React.useEffect(() => {
        let interval;
        if (step === 2 && isCounting && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            setIsCounting(false);
        }
        return () => clearInterval(interval);
    }, [step, isCounting, otpTimer]);

    //Handler untuk resend OTP
    const handleResendOtp = () => {
        setOtpTimer(60);
        setIsCounting(true);
        setFormData((prev) => ({ ...prev, otp: "" }));
        setTouched((prev) => ({ ...prev, otp: false }));
        setTimeout(() => {
            otpRefs[0]?.current?.focus();
        }, 0);
    };

    //Handler perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouched({ ...touched, [name]: true });

        setErrors((prev) => {
            const updatedErrors = { ...prev };
            if (name === "password" && value) {
                delete updatedErrors.password;
            }
            if (name === "confirmPassword" && value === formData.password) {
                delete updatedErrors.confirmPassword;
            }
            if (name === "fullName" && value.trim()) {
                delete updatedErrors.fullName;
            }
            if (name === "nickname" && value.trim()) {
                delete updatedErrors.nickname;
            }
            if (name === "address" && value.trim()) {
                delete updatedErrors.address;
            }
            return updatedErrors;
        });
    };

    //Validasi step 1
    const validateStep1 = () => {
        const newErrors = {};
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
        });

        const password = formData.password;
        //Cek email
        if (!formData.email.trim()) {
            newErrors.email = "Please fill in your email address.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email =
                "Invalid email format. Please enter a valid email.";
        } else if (emailExists) {
            newErrors.email =
                "This email is already registered. Try a different one.";
        }

        //Cek password
        if (!password) {
            newErrors.password = "Password is required.";
        } else {
            if (password.length < 8) {
                newErrors.password = "Password must be at least 8 characters.";
            }
            if (!/[A-Z]/.test(password)) {
                newErrors.password =
                    "Password must include at least one uppercase letter.";
            }
            if (!/[a-z]/.test(password)) {
                newErrors.password =
                    "Password must include at least one lowercase letter.";
            }
            if (!/\d/.test(password)) {
                newErrors.password =
                    "Password must include at least one number.";
            }
        }

        //Cek confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //State & handler untuk mengecek apakah email sudah terdaftar
    const [emailExists, setEmailExists] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);

    //Handler untuk perubahan email (cek ke backend)
    const handleEmailChange = async (e) => {
        const value = e.target.value;
        setFormData({ ...formData, email: value });
        setTouched({ ...touched, email: true });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value.trim()) {
            setEmailExists(false);
            setEmailChecked(false);
            setErrors((prev) => ({
                ...prev,
                email: "Please fill in your email address.",
            }));
            return;
        }

        if (!emailRegex.test(value)) {
            setErrors((prev) => ({
                ...prev,
                email: "Invalid email format. Please enter a valid email.",
            }));
            return;
        }

        try {
            const res = await axios.get(
                `/check-email?email=${encodeURIComponent(value)}`
            );
            const exists = res.data.exists;
            setEmailExists(exists);
            setEmailChecked(true);

            setErrors((prev) => {
                const updatedErrors = { ...prev };
                if (!exists) delete updatedErrors.email;
                else
                    updatedErrors.email =
                        "This email is already registered. Try a different one.";
                return updatedErrors;
            });
        } catch (error) {
            console.error("Fail To Check Email:", error);
        }
    };

    //Validasi step 2
    const validateStep2 = () => {
        const newErrors = {};
        setTouched((prev) => ({ ...prev, otp: true }));

        if (!formData.otp || formData.otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //Handler tombol next
    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;

        if (step === 1) {
            setFormData((prev) => ({ ...prev, otp: "" }));
            setTouched((prev) => ({ ...prev, otp: false }));
        }

        setStep(step + 1);
    };

    //Handler tombol submit di akhir
    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(
            "/users",
            {
                ...formData,
                role: "user",
                status: "active",
            },
            {
                onSuccess: () => Inertia.visit("/login"),
            }
        );
    };

    //Handler tombol back
    const handleBack = () => {
        if (step === 1) {
            window.location.href = "/";
        } else {
            setStep(1);
        }
    };

    const isLongEnough = formData.password.length >= 8;
    const hasUpperLower =
        /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(formData.email);
    const confirmValid =
        formData.confirmPassword &&
        formData.confirmPassword === formData.password;

    //Untuk auto focus input
    React.useEffect(() => {
        if (step === 1) {
            setTimeout(() => {
                emailRef.current?.focus();
            }, 0);
        }
        if (step === 2) {
            setFormData((prev) => ({ ...prev, otp: "" }));
            setTouched((prev) => ({ ...prev, otp: false }));
            setTimeout(() => {
                otpRefs[0]?.current?.focus();
            }, 0);
        }
        if (step === 3) {
            setTimeout(() => {
                fullNameRef.current?.focus();
            }, 0);
        }
    }, [step]);

    //Auto refresh
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setStep(1);
        }, 300000); // 5 menit
        return () => clearTimeout(timeout);
    }, [step, formData]);

    return (
        <Layout_Register>
            <Card className="bg-[#BCA3CA] rounded-2xl max-w-md mx-auto mt-12">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {step === 1
                            ? "Sign Up"
                            : step === 2
                            ? "OTP Authentication"
                            : "Finish Your Account"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                        {step === 1 &&
                            "Kindly fill in this form to set up your ToGather account"}
                        {step === 2 && (
                            <>
                                Please enter the 6 digit one time code
                                <br /> we have sent to &lt;{formData.email}&gt;
                            </>
                        )}
                        {step === 3 && "Finish your account detail"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="mb-5">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                // STEP 1: Email, Password, Confirm Password
                                if (step === 1) {
                                    if (
                                        document.activeElement ===
                                        emailRef.current
                                    ) {
                                        e.preventDefault();
                                        passwordRef.current?.focus();
                                    } else if (
                                        document.activeElement ===
                                        passwordRef.current
                                    ) {
                                        e.preventDefault();
                                        confirmPasswordRef.current?.focus();
                                    } else if (
                                        document.activeElement ===
                                        confirmPasswordRef.current
                                    ) {
                                        e.preventDefault();
                                        handleNext();
                                    }
                                }
                                // STEP 3: Fullname, Nickname, Address
                                else if (step === 3) {
                                    if (
                                        document.activeElement ===
                                        fullNameRef.current
                                    ) {
                                        e.preventDefault();
                                        nicknameRef.current?.focus();
                                    } else if (
                                        document.activeElement ===
                                        nicknameRef.current
                                    ) {
                                        e.preventDefault();
                                        addressRef.current?.focus();
                                    } else if (
                                        document.activeElement ===
                                        addressRef.current
                                    ) {
                                        // Submit form
                                        // Jangan preventDefault agar form submit jalan
                                    }
                                }
                                // STEP 2: Sudah dihandle di input OTP
                            }
                        }}
                    >
                        {step === 1 && (
                            <>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        ref={emailRef}
                                        value={formData.email}
                                        onChange={handleEmailChange}
                                        onBlur={() =>
                                            setTouched({
                                                ...touched,
                                                email: true,
                                            })
                                        }
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`input ${
                                            touched.email && !emailValid
                                                ? "border-red-500 ring-red-500"
                                                : touched.email && emailValid
                                                ? "border-green-500 ring-green-500"
                                                : ""
                                        }`}
                                        placeholder="Example@gmail.com"
                                    />

                                    {touched.email && errors.email && (
                                        <p className="text-sm mt-1 text-red-600">
                                            ✖ {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        ref={passwordRef}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() =>
                                            setTouched({
                                                ...touched,
                                                password: true,
                                            })
                                        }
                                        type="password"
                                        id="password"
                                        name="password"
                                        className={`input ${
                                            touched.password && errors.password
                                                ? "border-red-500 ring-red-500"
                                                : ""
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    {touched.password && (
                                        <ul className="text-sm mt-1 space-y-1">
                                            <li
                                                className={
                                                    isLongEnough
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {isLongEnough ? "✔" : "✖"} 8 or
                                                more characters
                                            </li>
                                            <li
                                                className={
                                                    hasUpperLower
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {hasUpperLower ? "✔" : "✖"}{" "}
                                                Upper & lowercase letters
                                            </li>
                                            <li
                                                className={
                                                    hasNumber
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {hasNumber ? "✔" : "✖"} At least
                                                one number
                                            </li>
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input
                                        ref={confirmPasswordRef}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={() =>
                                            setTouched({
                                                ...touched,
                                                confirmPassword: true,
                                            })
                                        }
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`input ${
                                            touched.confirmPassword &&
                                            !confirmValid
                                                ? "border-red-500 ring-red-500"
                                                : touched.confirmPassword &&
                                                  confirmValid
                                                ? "border-green-500 ring-green-500"
                                                : ""
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                    {touched.confirmPassword && (
                                        <p
                                            className={`text-sm mt-1 flex items-center gap-1 ${
                                                confirmValid
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {confirmValid ? "✔" : "✖"}{" "}
                                            {confirmValid
                                                ? "Password match"
                                                : errors.confirmPassword ||
                                                  "Passwords do not match"}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="text-center">
                                <div className="flex justify-center gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs[i]}
                                            type="text"
                                            maxLength="1"
                                            className={`w-10 h-12 text-center rounded border ${
                                                touched.otp && errors.otp
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            value={formData.otp[i] || ""}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/,
                                                        ""
                                                    );
                                                const newOtp =
                                                    formData.otp.split("");
                                                newOtp[i] = value;
                                                const newOtpValue =
                                                    newOtp.join("");

                                                setFormData({
                                                    ...formData,
                                                    otp: newOtpValue,
                                                });

                                                // Auto-focus ke next box jika ada value
                                                if (value && i < 5) {
                                                    otpRefs[
                                                        i + 1
                                                    ].current?.focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Backspace" &&
                                                    !formData.otp[i] &&
                                                    i > 0
                                                ) {
                                                    otpRefs[
                                                        i - 1
                                                    ].current?.focus();
                                                }
                                                // Enter langsung submit OTP (handleNext)
                                                if (
                                                    e.key === "Enter" &&
                                                    formData.otp.length === 6 &&
                                                    i === 5
                                                ) {
                                                    e.preventDefault();
                                                    handleNext();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                {touched.otp && errors.otp && (
                                    <p className="text-sm text-red-600 mt-2">
                                        {errors.otp}
                                    </p>
                                )}
                                {isCounting ? (
                                    <p className="mt-2 text-sm text-gray-700">
                                        Didn’t receive OTP ?{" "}
                                        <span className="font-semibold">
                                            Resend again in 00:
                                            {otpTimer
                                                .toString()
                                                .padStart(2, "0")}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-700">
                                        Didn’t receive OTP?{" "}
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="font-semibold text-blue-800 hover:underline"
                                        >
                                            Send Again
                                        </button>
                                    </p>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        ref={fullNameRef}
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        id="fullName"
                                        name="fullName"
                                        className={input}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nickname">Nickname</label>
                                    <input
                                        ref={nicknameRef}
                                        value={formData.nickname}
                                        onChange={handleChange}
                                        id="nickname"
                                        name="nickname"
                                        className={input}
                                        placeholder="Enter your nickname"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address">Alamat</label>
                                    <input
                                        ref={addressRef}
                                        value={formData.address}
                                        onChange={handleChange}
                                        id="address"
                                        name="address"
                                        className={input}
                                        placeholder="Enter your address"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-center gap-24 mt-4 relative">
                            {[1, 2, 3].map((n, index) => (
                                <div
                                    key={n}
                                    className="relative z-10 flex items-center"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${
                                            step >= n
                                                ? "bg-[#5a4070] text-white"
                                                : "bg-white text-black border border-gray-300"
                                        }`}
                                    >
                                        {n}
                                    </div>
                                    {index < 2 && (
                                        <div
                                            className={`absolute top-1/2 left-full transform -translate-y-1/2 w-24 h-1 ${
                                                step > n
                                                    ? "bg-[#5a4070]"
                                                    : "bg-white"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <CardFooter className="flex justify-end items-center p-0 pt-4">
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="register-btn"
                                >
                                    {step === 2 ? "Submit" : "Next"}
                                </button>
                            ) : (
                                <button type="submit" className="register-btn">
                                    Done
                                </button>
                            )}
                        </CardFooter>
                        <CardFooter className="flex justify-end p-0">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="register-btn mt-4"
                            >
                                Back
                            </button>
                        </CardFooter>
                    </form>
                    {step === 1 && (
                        <p className="text-sm mt-6 text-center">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-blue-800 hover:underline"
                            >
                                Login Now
                            </Link>
                        </p>
                    )}
                </CardContent>
            </Card>
        </Layout_Register>
    );
}

const input = `block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300
    placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white`;
