export default function StepOne({next, formData, setFormData}){
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <>
            <h1 className="title">Sign Up</h1>
            <div className="w-1/2 mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-4">
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
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button type="submit" className="primary-btn mt-4" >
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}