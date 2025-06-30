import { Inertia } from "@inertiajs/inertia";

export default function StepThree({ next, formData, setFormData }) {
    function Submit(e) {
        e.preventDefault();
        Inertia.post(
            "/users",
            {
                username: formData.username,
                nickname: formData.nickname,
                email: formData.email,
                address: formData.address,
                password: formData.password,
                role: "user",
                status: "active",
            },
            {
                onSuccess: () => {
                    next();
                },
                onError: (errors) => {
                    console.error(errors);
                },
                preserveState: true,
            }
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen w-screen">
            {/* Background Kiri */}
            <div
                className="w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/backgroundImg/bg_purple_registerPage.jpg')",
                }}
            />
            {/* Background Kanan */}
            <div className="w-1/2 bg-white" />

            {/* Form */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#b491c8] rounded-2xl p-10 w-[448px] h-[540px] text-center shadow-xl flex flex-col justify-between">
                    <h1 className="text-2xl font-bold mb-2 text-black">
                        Finish Your Account
                    </h1>
                    <p className="text-sm text-black mb-6">
                        Finish your account detail
                    </p>

                    <form onSubmit={Submit} className="space-y-4 text-left">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="username"
                                className="text-white text-sm"
                            >
                                Full Name
                            </label>
                            <input
                                value={formData.username}
                                onChange={handleChange}
                                id="username"
                                name="username"
                                className="w-full p-2 rounded-md mt-1 bg-white text-black placeholder:text-gray-500"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        {/* Nickname */}
                        <div>
                            <label
                                htmlFor="nickname"
                                className="text-white text-sm"
                            >
                                Nickname
                            </label>
                            <input
                                value={formData.nickname}
                                onChange={handleChange}
                                id="nickname"
                                name="nickname"
                                className="w-full p-2 rounded-md mt-1 bg-white text-black placeholder:text-gray-500"
                                placeholder="Your nickname"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label
                                htmlFor="address"
                                className="text-white text-sm"
                            >
                                Address
                            </label>
                            <input
                                value={formData.address}
                                onChange={handleChange}
                                id="address"
                                name="address"
                                className="w-full p-2 rounded-md mt-1 bg-white text-black placeholder:text-gray-500"
                                placeholder="Your address"
                                required
                            />
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center gap-24 mt-4 relative">
                            {[1, 2, 3].map((n, index) => (
                                <div key={n} className="relative z-10">
                                    <div
                                        className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${
                                            n <= 3
                                                ? "bg-[#5a4070] text-white"
                                                : "bg-white text-black"
                                        }`}
                                    >
                                        {n}
                                    </div>
                                    {index < 2 && (
                                        <div className="absolute top-1/2 left-full w-24 h-1 bg-[#5a4070] transform -translate-y-1/2 z-0" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#694c82] text-white py-2 mt-4 rounded-md hover:bg-[#5a4070]"
                        >
                            Done
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
