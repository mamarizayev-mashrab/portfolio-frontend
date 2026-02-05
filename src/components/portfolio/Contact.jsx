import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';

const Contact = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState('IDLE');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [contactInfo, setContactInfo] = useState({
        email: 'mashrabmamarizayev@gmail.com',
        location: 'Jizzax, Uzbekistan'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data.data && response.data.data.contact) {
                    const { contact } = response.data.data;
                    setContactInfo(prev => ({
                        email: contact.email || prev.email,
                        location: contact.location?.[t.language] || contact.location?.en || prev.location
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch contact settings');
            }
        };
        fetchSettings();
    }, [t.language]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = t('contact.validation.nameRequired', 'Name is required');
        }
        if (!formData.email.trim()) {
            newErrors.email = t('contact.validation.emailRequired', 'Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.validation.emailInvalid', 'Invalid email format');
        }
        if (!formData.message.trim()) {
            newErrors.message = t('contact.validation.messageRequired', 'Message is required');
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

        setStatus('SENDING');

        try {
            await api.post('/messages', formData);
            setStatus('SUCCESS');
            setFormData({ name: '', email: '', message: '' });

            // Reset status after 5 seconds
            setTimeout(() => setStatus('IDLE'), 5000);
        } catch (error) {
            setStatus('ERROR');
            console.error('Error sending message:', error);

            // Reset status after 3 seconds
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <section id="contact" className="py-24 bg-[var(--background)] border-t border-[var(--accents-2)]">
            <div className="v-container">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4 mb-20 text-center">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block font-bold">// connect_node</span>
                        <h2 className="text-5xl font-bold tracking-tighter">{t('contact.title', 'Get in Touch')}</h2>
                        <p className="text-[var(--accents-5)] text-lg">{t('contact.description', 'Available for selective technical partnerships and design systems.')}</p>
                    </div>

                    <div className="v-card space-y-12 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">
                                        {t('contact.form.name', 'Full Name')}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)] ${errors.name ? 'border-error-light!' : ''}`}
                                        placeholder={t('contact.form.namePlaceholder', 'Enter your name')}
                                    />
                                    {errors.name && <span className="text-xs text-error-light">{errors.name}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">
                                        {t('contact.form.email', 'Email Address')}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)] ${errors.email ? 'border-error-light!' : ''}`}
                                        placeholder={t('contact.form.emailPlaceholder', 'example@email.com')}
                                    />
                                    {errors.email && <span className="text-xs text-error-light">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">
                                    {t('contact.form.message', 'Message')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)] min-h-[160px] py-4 resize-none ${errors.message ? 'border-error-light!' : ''}`}
                                    placeholder={t('contact.form.messagePlaceholder', 'Write your message here...')}
                                />
                                {errors.message && <span className="text-xs text-error-light">{errors.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'SENDING'}
                                className={`w-full h-12 rounded-md font-bold tracking-tight transition-all flex items-center justify-center gap-3 ${status === 'SUCCESS'
                                        ? 'bg-success-dark text-white'
                                        : status === 'ERROR'
                                            ? 'bg-error-dark text-white'
                                            : 'v-btn-primary'
                                    }`}
                            >
                                {status === 'IDLE' && t('contact.form.submit', 'Send Message')}
                                {status === 'SENDING' && (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                        {t('contact.form.sending', 'Sending...')}
                                    </>
                                )}
                                {status === 'SUCCESS' && t('contact.success', 'Message sent successfully!')}
                                {status === 'ERROR' && t('contact.error', 'Error sending message. Try again.')}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[var(--accents-2)]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-tighter">Primary.Mail</span>
                                <span className="text-sm font-medium">{contactInfo.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-tighter">Base.Location</span>
                                <span className="text-sm font-medium">{contactInfo.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
