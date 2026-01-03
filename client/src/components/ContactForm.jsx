import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

const ContactForm = ({ onContactAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Validation functions
    const validateName = (name) => {
        if (!name.trim()) return 'Name is required';
        if (name.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone.trim()) return 'Phone number is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid 10-digit phone number';
        return '';
    };

    // Handle input change with real-time validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle blur to validate field
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://contact-management-8kc-xhl.vercel.app/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    phone: formData.phone.replace(/\s/g, '') // Remove spaces from phone
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setErrors({});

                // Notify parent component
                onContactAdded(data.data, 'Contact added successfully! 🎉');
            } else {
                // Handle server-side errors
                if (data.errors) {
                    const serverErrors = {};
                    data.errors.forEach(err => {
                        serverErrors[err.path] = err.msg;
                    });
                    setErrors(serverErrors);
                } else {
                    onContactAdded(null, data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            onContactAdded(null, 'Failed to add contact. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.phone &&
        !errors.name && !errors.email && !errors.phone;

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Add New Contact</h2>
                <p className="text-slate-600">Fill in the details below to add a new contact to your list.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    required
                    placeholder="Enter full name"
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    required
                    placeholder="example@email.com"
                />

                <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.phone}
                    required
                    placeholder="1234567890"
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all duration-200 placeholder:text-slate-400 resize-none"
                        placeholder="Optional message..."
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    {loading ? 'Adding Contact...' : 'Add Contact'}
                </Button>
            </form>
        </div>
    );
};

export default ContactForm;
