import { Inertia } from "@inertiajs/inertia";
import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Layout_L from "../../Layouts/Layout_Login";
import { Link, usePage } from "@inertiajs/react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [clientErrors, setClientErrors] = useState({});
    const [touched, setTouched] = useState({});
    const { errors: serverErrors } = usePage().props;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouched({ ...touched, [name]: true });

        // Remove error messagenya kalau valid
        setClientErrors((prev) => {
            const updated = { ...prev };
            if (name === "email" && emailRegex.test(value)) {
                delete updated.email;
            }
            if (name === "password" && value.trim()) {
                delete updated.password;
            }
            return updated;
        });
    };

    const validateLogin = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Please fill in your email address.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setTouched({
            email: true,
            password: true,
        });

        if (!validateLogin()) return;

        Inertia.post("/login", formData);
    };

    const showError = (field) =>
        clientErrors[field] &&
        (touched[field] || Object.keys(touched).length === 2);

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
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() =>
                                    setTouched({ ...touched, email: true })
                                }
                                type="email"
                                id="email"
                                name="email"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ${
                                    showError("email")
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300"
                                } placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white`}
                                placeholder="Enter your email"
                            />
                            {showError("email") && (
                                <p className="text-sm text-red-600 mt-1">
                                    ✖ {clientErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() =>
                                    setTouched({ ...touched, password: true })
                                }
                                type="password"
                                id="password"
                                name="password"
                                className={`block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ${
                                    showError("password")
                                        ? "ring-red-500 border-red-500"
                                        : "ring-slate-300"
                                } placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white`}
                                placeholder="Enter your password"
                            />
                            {showError("password") && (
                                <p className="text-sm text-red-600 mt-1">
                                    ✖ {clientErrors.password}
                                </p>
                            )}
                        </div>

                        <CardFooter className="flex justify-end p-0">
                            <button type="submit" className="register-btn mt-4">
                                Submit
                            </button>
                        </CardFooter>
                        <CardFooter className="flex justify-end p-0">
                            <Link href="/" className="register-btn mt-4">
                                Back
                            </Link>
                        </CardFooter>

                        {/* Error dari backend (misalnya: password salah) TIDAK BEKERJA BABI*/}
                        {serverErrors.email &&
                            !clientErrors.email &&
                            !clientErrors.password && (
                                <p className="text-sm text-red-600 text-center mt-4 bg-white px-2 py-1 rounded">
                                    ✖ {serverErrors.email}
                                </p>
                            )}
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
