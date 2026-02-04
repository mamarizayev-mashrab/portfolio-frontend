import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState('IDLE');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('SENDING');
        setTimeout(() => setStatus('SUCCESS'), 2000);
    };

    return (
        <section id="contact" className="py-24 bg-[var(--background)] border-t border-[var(--accents-2)]">
            <div className="v-container">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4 mb-20 text-center">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block font-bold">// connect_node</span>
                        <h2 className="text-5xl font-bold tracking-tighter">Get in Touch</h2>
                        <p className="text-[var(--accents-5)] text-lg">Available for selective technical partnerships and design systems.</p>
                    </div>

                    <div className="v-card space-y-12 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        className="v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)]"
                                        placeholder="Identify yourself"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        className="v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)]"
                                        placeholder="protocol@service.io"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">Message Log</label>
                                <textarea
                                    className="v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)] hover:border-[var(--accents-3)] min-h-[160px] py-4 resize-none"
                                    placeholder="Enter your transmission data..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== 'IDLE'}
                                className={`w-full h-12 rounded-md font-bold tracking-tight transition-all flex items-center justify-center gap-3 ${status === 'SUCCESS'
                                        ? 'bg-success-dark text-white'
                                        : 'v-btn-primary'
                                    }`}
                            >
                                {status === 'IDLE' && 'Send Transmission'}
                                {status === 'SENDING' && (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                        Transmitting...
                                    </>
                                )}
                                {status === 'SUCCESS' && 'Transmission Confirmed'}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[var(--accents-2)]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-tighter">Primary.Mail</span>
                                <span className="text-sm font-medium">mamarizayev@mashrab.uz</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-tighter">Base.Location</span>
                                <span className="text-sm font-medium">Tashkent, Uzbekistan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
