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
import Layout_LR from "../../Layouts/Layout_LR"
import { Link } from '@inertiajs/react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    Inertia.post('/users', {
      ...formData,
      role: 'user',
      status: 'inactive',
    });
  };

  return (
    <Layout_LR>
        <Card className="bg-[#BCA3CA]">
            <CardHeader className="mt-5">
            <CardTitle className="text-2xl mx-auto">Sign Up</CardTitle>
            <CardDescription className="mx-auto">Please fill out the form below to register.</CardDescription>
            </CardHeader>

            <CardContent className="mb-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label htmlFor="email">Email</label>
                    <input
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        id="email"
                        name="email"
                        className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                        placeholder="Enter your email"
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="nickname">Nickname</label>
                    <input
                        value={formData.nickname}
                        onChange={handleChange}
                        id="nickname"
                        name="nickname"
                        className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                        placeholder="Enter your nickname"
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="address">Address</label>
                    <input
                        value={formData.address}
                        onChange={handleChange}
                        id="address"
                        name="address"
                        className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                        placeholder="Enter your address"
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="password">Password</label>
                    <input
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        id="password"
                        name="password"
                        className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                        placeholder="Enter your password"
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                        placeholder="Confirm your password"
                        required
                    />
                    </div>

                    <CardFooter className="flex justify-end p-0">
                    <button type="submit" className="register-btn mt-4">
                        Submit
                    </button>
                    </CardFooter>
                </form>
                <p className="text-sm mt-4  mx-auto">
                    Already have an account? <Link href="/login" className="font-semibold">Login</Link>
                </p>
            </CardContent>
        </Card>
    </Layout_LR>
  );
}
