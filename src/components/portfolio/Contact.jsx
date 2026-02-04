/**
 * Contact Section Component
 * Contact form with validation and backend submission
 */

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../common/Toast';
import api from '../../api/axios';
import { ButtonSpinner } from '../common/Loading';

const Contact = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('contact.validation.nameRequired');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.validation.emailInvalid');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.validation.messageRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.post('/messages', formData);
            toast.success(t('contact.success'));
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            const message = error.response?.data?.message || t('contact.error');
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-dark-950" />

            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('contact.title')}</h2>
                    <p className="section-subtitle">{t('contact.description')}</p>
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
                                    {t('contact.form.name')} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder={t('contact.form.name')}
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                {errors.name && (
                                    <p id="name-error" className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                                    {t('contact.form.email')} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder={t('contact.form.email')}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-dark-300 mb-2">
                                {t('contact.form.subject')}
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('contact.form.subject')}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-dark-300 mb-2">
                                {t('contact.form.message')} <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                className={`input-field resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                                placeholder={t('contact.form.message')}
                                aria-invalid={!!errors.message}
                                aria-describedby={errors.message ? 'message-error' : undefined}
                            />
                            {errors.message && (
                                <p id="message-error" className="mt-1 text-sm text-red-400">{errors.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary min-w-[200px]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <ButtonSpinner />
                                        {t('contact.form.sending')}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {t('contact.form.submit')}
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
