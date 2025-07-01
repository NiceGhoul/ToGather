import { Inertia } from "@inertiajs/inertia";
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Layout_LR from "../../Layouts/Layout_LR";
import { Link } from "@inertiajs/react";

export default function OTP_Confirmation({ user }) {
    const [number, setNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!number.trim()) {
        alert("OTP cannot be empty");
        return;
        }

        Inertia.post(`/users/${user.id}/activate`, {
        number,
        }, {
        onSuccess: () => Inertia.visit('/login'), // Redirect to login after success
        });
    };

    return (
        <Layout_LR>
        <Card className="bg-[#BCA3CA]">
            <CardHeader className="mt-5">
            <CardTitle className="text-2xl mx-auto">OTP Verification</CardTitle>
            <CardDescription className="mx-auto">Please enter the OTP to activate your account.</CardDescription>
            </CardHeader>

            <CardContent className="mb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="number">Enter OTP</label>
                <input
                    id="number"
                    name="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                    placeholder="Enter OTP"
                    required
                />
                </div>

                <CardFooter className="flex justify-between items-center p-0 pt-4">
                <Link href="/users/create" className="text-sm text-blue-800 hover:underline">
                    Back to Login
                </Link>
                <button type="submit" className="register-btn mt-0">
                    Submit
                </button>
                </CardFooter>
            </form>
            </CardContent>
        </Card>
        </Layout_LR>
    );
}
