// This file defines the AuthModel class for authentication purposes.

export class AuthModel {
    email: string;
    password: string;
    unit: string;
    role: string;

    constructor(email: string, password: string, unit: string, role: string) {
        this.email = email;
        this.password = password;
        this.unit = unit;
        this.role = role;
    }

    // Method to validate email format
    validateEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    // Method to validate password strength
    validatePassword(): boolean {
        return this.password.length >= 6; // Example: minimum length of 6
    }
}