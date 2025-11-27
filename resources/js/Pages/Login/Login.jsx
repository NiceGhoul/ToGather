import React, { useState, useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import { Spinner } from "@/Components/ui/spinner";
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
    const [showBannedAlert, setShowBannedAlert] = React.useState(false);
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

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
        setIsSubmitLoading(true);
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
                // Check if account is banned
                if (err.banned) {
                    setShowBannedAlert(true);
                    setBackendError("");
                } else if (err.email && !err.password) {
                    setBackendError(err.email);
                    setShowBannedAlert(false);
                } else {
                    setBackendError("");
                    setShowBannedAlert(false);
                }
                setIsSubmitLoading(false)
            },
            onFinish: () => setIsSubmitLoading(false),

        });
    };

    return (
        <Layout_L>
            {/* Banned Account Alert Dialog */}
            <AlertDialog open={showBannedAlert} onOpenChange={setShowBannedAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            Account Banned
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {errors.banned || 'Your account has been banned. Please contact support for more information.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setShowBannedAlert(false)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="bg-[#BCA3CA] dark:bg-gray-800">
                <CardHeader className="mt-5">
                    <CardTitle className="text-2xl mx-auto dark:text-white">Login</CardTitle>
                    <CardDescription className="mx-auto dark:text-gray-300">
                        Please fill out the form below to login.
                    </CardDescription>
                </CardHeader>

                <CardContent className="mb-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="dark:text-gray-200">Email</label>
                            <input
                                ref={emailRef}
                                value={data.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="email"
                                id="email"
                                name="email"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${
                                    (clientErrors.email && touched.email) ||
                                    errors.email
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300 dark:ring-gray-600"
                                } placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800`}
                                placeholder="Enter your email"
                            />
                            {clientErrors.email && touched.email && (
                                <p className="text-sm text-red-600 mt-1">
                                    ✖ {clientErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="dark:text-gray-200">Password</label>
                            <input
                                ref={passwordRef}
                                value={data.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="password"
                                id="password"
                                name="password"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${
                                    (clientErrors.password &&
                                        touched.password) ||
                                    errors.password
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300 dark:ring-gray-600"
                                } placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800`}
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
                                className="register-btn disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                disabled={isSubmitLoading}
                            >
                                {isSubmitLoading && <Spinner className="w-4 h-4" />}
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

                    <p className="text-sm mt-4 mx-auto dark:text-gray-300">
                        Didn't have an account yet?{" "}
                        <Link href="/users/create" className="font-semibold dark:text-white">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </Layout_L>
    );
}
