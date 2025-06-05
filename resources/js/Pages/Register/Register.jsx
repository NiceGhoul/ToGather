import { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        number: '',
        username: '',
        nickname: '',
        address: '',
    });

    const next = () => setStep((prev) => prev + 1);
    const back = () => setStep((prev) => prev - 1);

    return (
        <>
            {step === 1 && <StepOne next={next} formData={formData} setFormData={setFormData} />}
            {step === 2 && <StepTwo next={next} back={back} formData={formData} setFormData={setFormData} />}
            {step === 3 && <StepThree back={back} formData={formData} setFormData={setFormData} />}
        </>
    );
}