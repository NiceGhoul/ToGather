import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';

export default function OTP_Cinfirmation({user}) {
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
        onSuccess: () => Inertia.visit('/'),
    });
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-1/2 mx-auto">
            <h1 className="title">Verify</h1>

            <div>
                <label>Enter Number</label>
                <input 
                    name="number" 
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                    className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                    required 
                />
            </div>

            <div className="flex gap-4 mt-4">
                <button type="button" className="text-link" >Back</button>
                <button type="submit" className="primary-btn">Submit</button>
            </div>
        </form>
    );
}
