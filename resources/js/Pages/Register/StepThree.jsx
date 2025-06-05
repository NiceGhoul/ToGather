import { Inertia } from '@inertiajs/inertia';

export default function StepThree({next, formData, setFormData}){
    function Submit(e){
        e.preventDefault();
        Inertia.post("/users", {
            username: formData.username,
            nickname: formData.nickname,
            email: formData.email,
            address: formData.address,
            password: formData.password,
            role: 'user',
            status: 'active',
        }, {
        onSuccess: () => {
            next();  // move to next step only after success, no reload
        },
        onError: (errors) => {
            // handle validation errors if any
            console.error(errors);
        },
        preserveState: true, // optional to prevent page reload
        });             
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <>
            <h1 className="title">Sign Up</h1>
            <div className="w-1/2 mx-auto">
                <form onSubmit={Submit} className="space-y-4">
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            value={formData.username}
                            onChange={handleChange}
                            id="username"
                            name="username"
                            className="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="nickname">nickname</label>
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
                            placeholder="Enter you address"
                            required
                        />
                    </div>

                    <button className="primary-btn mt-4" >
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}