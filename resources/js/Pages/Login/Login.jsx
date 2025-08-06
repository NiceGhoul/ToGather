import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Layout_L from "../../Layouts/Layout_Login";
import { Link, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            email: "",
            password: "",
        });
    const [clientErrors, setClientErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});
    const [backendError, setBackendError] = React.useState("");
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = () => {
        const newErrors = {};
        if (!data.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(data.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!data.password.trim()) {
            newErrors.password = "Password is required.";
        }
        setClientErrors(newErrors);
        return newErrors;
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
        // Clear error saat user mengetik
        setClientErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setBackendError(""); // Hapus error backend jika validasi gagal
            clearErrors();
            // Fokus ke field error pertama
            if (validationErrors.email) {
                emailRef.current && emailRef.current.focus();
            } else if (validationErrors.password) {
                passwordRef.current && passwordRef.current.focus();
            }
            return;
        }
        post("/user/login", {
            preserveScroll: true,
            replace: true,
            onError: (err) => {
                // Simpan error backend ke state agar bisa dikontrol
                if (err.email && !err.password) {
                    setBackendError(err.email);
                } else {
                    setBackendError("");
                }
            },
        });
    };

    return (
        <Layout_L>
            <Card className="bg-[#BCA3CA]">
                <CardHeader className="mt-5">
                    <CardTitle className="text-2xl mx-auto">Login</CardTitle>
                    <CardDescription className="mx-auto">
                        Please fill out the form below to login.
                    </CardDescription>
                </CardHeader>

                <CardContent className="mb-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                ref={emailRef}
                                value={data.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="email"
                                id="email"
                                name="email"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ${
                                    (clientErrors.email && touched.email) ||
                                    errors.email
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300"
                                } placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white`}
                                placeholder="Enter your email"
                            />
                            {clientErrors.email && touched.email && (
                                <p className="text-sm text-red-600 mt-1">
                                    ✖ {clientErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                ref={passwordRef}
                                value={data.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="password"
                                id="password"
                                name="password"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ${
                                    (clientErrors.password &&
                                        touched.password) ||
                                    errors.password
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300"
                                } placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white`}
                                placeholder="Enter your password"
                            />
                            {clientErrors.password && touched.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    ✖ {clientErrors.password}
                                </p>
                            )}
                        </div>

                        <CardFooter className="flex flex-col items-end p-0">
                            {backendError &&
                                !errors.password &&
                                !clientErrors.email &&
                                !clientErrors.password && (
                                    <p className="text-sm text-red-600 mt-4 px-2 py-1 rounded w-full">
                                        ✖ {backendError}
                                    </p>
                                )}
                            <button
                                type="submit"
                                className="register-btn mt-4"
                                disabled={processing}
                            >
                                Submit
                            </button>
                            {/* Error dari backend (email/password missmatch) hanya di bawah tombol submit */}
                        </CardFooter>
                        <CardFooter className="flex justify-end p-0">
                            <Link href="/" className="back-btn mt-4">
                                Back
                            </Link>
                        </CardFooter>
                    </form>

                    <p className="text-sm mt-4 mx-auto">
                        Didn't have an account yet?{" "}
                        <Link href="/users/create" className="font-semibold">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </Layout_L>
    );
}
