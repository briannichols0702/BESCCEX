"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormContent = void 0;
const VerificationForm_1 = require("./VerificationForm");
const TwoFactorForm_1 = require("./TwoFactorForm");
const LoginForms_1 = require("./LoginForms");
const login_1 = require("@/stores/auth/login");
const FormContentBase = () => {
    const { isVerificationStep, is2FAVerificationStep } = (0, login_1.useLoginStore)();
    if (isVerificationStep) {
        return <VerificationForm_1.VerificationForm />;
    }
    else if (is2FAVerificationStep) {
        return <TwoFactorForm_1.TwoFactorForm />;
    }
    else {
        return <LoginForms_1.LoginForms />;
    }
};
exports.FormContent = FormContentBase;
