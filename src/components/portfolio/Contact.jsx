import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SUCCESS

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('SENDING');
        setTimeout(() => setStatus('SUCCESS'), 2000);
    };

    return (
        <section id="contact" className="py-24 bg-background relative overflow-hidden border-t border-dark-800">
            <div className="v-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Left: Narrative */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="v-text-mono text-primary">// establish_link</span>
                            <h2 className="v-heading text-white">Let's build the <br /><span className="text-dark-500 italic">Future of Web.</span></h2>
                        </div>
                        <p className="text-dark-300 max-w-md leading-relaxed">
                            Currently open for high-impact collaborations and technical leadership roles.
                            If you have a project that requires a fusion of high-end engineering and exceptional design, reach out.
                        </p>

                        <div className="space-y-6 pt-8">
                            <div className="flex flex-col gap-1">
                                <span className="v-text-mono text-dark-500 font-bold text-xs uppercase tracking-widest">Protocol</span>
                                <span className="text-white font-mono text-lg lowercase tracking-tight">mamarizayev@mashrab.tech</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="v-text-mono text-dark-500 font-bold text-xs uppercase tracking-widest">Frequency</span>
                                <span className="text-white font-mono text-lg tracking-tight">+998 00 000 00 00</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form (Vercel Style) */}
                    <div className="manga-panel p-1 border-dark-800">
                        <form onSubmit={handleSubmit} className="bg-background-soft p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="v-text-mono text-[10px] tracking-widest">Full_Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-dark-700 py-3 text-white placeholder-dark-600 focus:outline-none focus:border-white transition-all font-mono"
                                        placeholder="INPUT_ID_NAME"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="v-text-mono text-[10px] tracking-widest">Protocol_Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-transparent border-b border-dark-700 py-3 text-white placeholder-dark-600 focus:outline-none focus:border-white transition-all font-mono"
                                        placeholder="MAIL@DOMAIN.IO"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="v-text-mono text-[10px] tracking-widest">Data_Packet_Message</label>
                                <textarea
                                    className="w-full bg-transparent border-b border-dark-700 py-3 text-white placeholder-dark-600 focus:outline-none focus:border-white transition-all font-mono min-h-[120px] resize-none"
                                    placeholder="TRANSMIT_DATA_HERE..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== 'IDLE'}
                                className={`w-full py-4 font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${status === 'SUCCESS' ? 'bg-accent text-white' : 'v-btn-primary hover:glow-purple'
                                    }`}
                            >
                                {status === 'IDLE' && 'EXECUTE_SEND'}
                                {status === 'SENDING' && (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                                        TRANSMITTING...
                                    </>
                                )}
                                {status === 'SUCCESS' && 'DATA_SENT_CONFIRMED'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
