import React, { useState } from 'react';
import { LockKeyhole, Info, Eye, AlertTriangle, AlertCircle, Shield, CheckCircle, EyeOff } from "lucide-react";
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

interface PasswordType {
    str: string;
    error: boolean;
}

interface Props<T> {
    password: T;
    setPassword: (password: T) => void;
    name: string;
    placeholder: string;
}

const PasswordInput = <T extends PasswordType>({ password, setPassword, name, placeholder }: Props<T>) => {

    const options = {
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
        },
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        translations: zxcvbnEnPackage.translations,
    }
    zxcvbnOptions.setOptions(options);

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<"weak" | "fair" | "good" | "strong" | "">("");

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword({ ...password, str: newPassword, error: false });
        validatePasswordStrength(newPassword);
    };

    const validatePasswordStrength = (password: string) => {
        const result = zxcvbn(password);
        switch (result.score) {
            case 0:
            case 1:
                setPasswordStrength('weak');
                break;
            case 2:
                setPasswordStrength('fair');
                break;
            case 3:
                setPasswordStrength('good');
                break;
            case 4:
                setPasswordStrength('strong');
                break;
            default:
                setPasswordStrength('');
                break;
        }
    };

    const getStrengthIcon = (strength: string) => {
        switch (strength) {
            case 'weak':
                return (<div className='font-medium text-sm text-[#FF4D4D] flex gap-3 items-center px-8 mb-3'>
                    <AlertTriangle size={20} />
                    <p>Weak</p>
                  </div>); // Red
            case 'fair':
                return (<div className='font-medium text-sm text-[#FFA500] flex gap-3 px-8 items-center mb-3'>
                    <AlertCircle size={20} />
                    <p>Fair</p>
                  </div>); // Orange
            case 'good':
                return (<div className='font-medium text-sm text-[#FFFF00] flex gap-3 items-center px-8 mb-3'>
                    <Shield size={20} />
                    <p>Good</p>
                  </div>); // Yellow
            case 'strong':
                return (<div className='font-medium text-sm text-[#32CD32] flex gap-3 items-center px-8 mb-3'>
                    <CheckCircle size={20} />
                    <p>Strong</p>
                  </div>); // Green
            default:
                return null;
        }
    }

    return (
        <div>
            <div className={`flex items-center ${password.error ? "border-2 border-red-500" : "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                <LockKeyhole size={20} />
                <input
                    className="pl-2 w-full outline-none border-none"
                    type={showPassword ? "text" : "password"}
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    value={password.str}
                    onChange={handlePasswordChange}
                />
                <button type = "button" onClick={toggleShowPassword} className="w-4 h-4 rounded-full flex justify-center items-center">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {password.error && <Info size={20} color="rgb(239 68 68)" />}
            </div>
            {getStrengthIcon(passwordStrength)}
            {password.error && <p className="text-red-500 text-size-400 font-normal m-2">Password must contain alphabets, digits, special characters and be within 8 to 15 characters</p>}
        </div>
    );
};

export default PasswordInput;
