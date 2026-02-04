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
        <section id="contact" className="py-32 bg-background relative border-t border-dark-800">
            <div className="v-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="v-text-mono text-[10px] text-primary tracking-widest font-black uppercase">communication_online</span>
                            </div>
                            <h2 className="v-heading text-white">Let's create a <br /><span className="text-dark-400 italic">Premium Reality.</span></h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-center gap-6 p-6 bg-dark-900 rounded-[20px] border border-dark-700 hover:border-primary/50 transition-colors group">
                                <div className="w-14 h-14 bg-dark-800 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    {/* iOS Style Mail Icon */}
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#007AFF]">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-dark-500 uppercase tracking-widest font-bold">Mail.Protocol</span>
                                    <span className="text-white font-mono text-lg font-medium">mamarizayev@mashrab.uz</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-dark-900 rounded-[20px] border border-dark-700 hover:border-accent/50 transition-colors group">
                                <div className="w-14 h-14 bg-dark-800 rounded-[14px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    {/* iOS Style Phone Icon */}
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#34C759]">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-dark-500 uppercase tracking-widest font-bold">Base.Frequency</span>
                                    <span className="text-white font-mono text-lg font-medium">+998 90 000 00 00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* iOS Card Overlay Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl opacity-30 rounded-full" />

                        <form onSubmit={handleSubmit} className="relative bg-dark-900/50 backdrop-blur-2xl p-12 rounded-[32px] border border-white/5 shadow-2xl space-y-10">
                            <div className="space-y-8">
                                <div className="group relative">
                                    <label className="absolute -top-3 left-4 bg-dark-900 px-2 text-[9px] font-mono text-dark-500 tracking-widest uppercase font-black z-10">identity_name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-800/50 rounded-[14px] border border-dark-700 p-4 text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                                        placeholder="ENTER_SENDER_NAME"
                                        required
                                    />
                                </div>
                                <div className="group relative">
                                    <label className="absolute -top-3 left-4 bg-dark-900 px-2 text-[9px] font-mono text-dark-500 tracking-widest uppercase font-black z-10">terminal_email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-dark-800/50 rounded-[14px] border border-dark-700 p-4 text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                                        placeholder="MAIL_ID@DOMAIN.COM"
                                        required
                                    />
                                </div>
                                <div className="group relative">
                                    <label className="absolute -top-3 left-4 bg-dark-900 px-2 text-[9px] font-mono text-dark-500 tracking-widest uppercase font-black z-10">data_stream</label>
                                    <textarea
                                        className="w-full bg-dark-800/50 rounded-[18px] border border-dark-700 p-4 text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm min-h-[160px] resize-none"
                                        placeholder="INPUT_MESSAGE_LOG..."
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status !== 'IDLE'}
                                className={`group relative w-full h-16 rounded-[18px] font-mono font-black tracking-widest uppercase transition-all overflow-hidden flex items-center justify-center gap-4 ${status === 'SUCCESS' ? 'bg-[#34C759] text-white' : 'bg-white text-black hover:scale-[0.98]'
                                    }`}
                            >
                                {status === 'IDLE' && (
                                    <>
                                        COMMENCE_TRANSMISSION
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transform group-hover:translate-x-1 transition-transform">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                    </>
                                )}
                                {status === 'SENDING' && (
                                    <div className="w-6 h-6 border-3 border-black/20 border-t-black animate-spin rounded-full" />
                                )}
                                {status === 'SUCCESS' && 'DATA_TRANSMITTED_OK'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
