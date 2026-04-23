import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Instagram, Linkedin, Twitter, 
  MapPin, Phone, Send, Loader2, Star, 
  Globe, ShieldCheck, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contacts', formData);
      toast.success("Message received. Our team will contact you.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="py-24 md:py-32 bg-[#F9FAFB] dark:bg-[#080C10] min-h-screen font-sans selection:bg-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <motion.div {...fadeInUp} className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full mb-6 border border-brand-100 dark:border-brand-800">
             <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-700 dark:text-brand-300">Get in Touch</span>
          </motion.div>
          <motion.h1 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 dark:text-white tracking-tighter"
          >
            Contact <span className="text-gradient">Us.</span>
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed"
          >
            Reach out to us for any inquiries, technical support, or partnership opportunities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-2 space-y-12"
          >
            <div className="space-y-10">
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Verified Channels</h3>
                  <div className="space-y-8">
                     <div className="flex items-center space-x-6 group">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                           <Mail className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                           <p className="text-sm font-black dark:text-white">support@finfleet.academy</p>
                        </div>
                     </div>

                     <div className="flex items-center space-x-6 group">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                           <Globe className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">HQ Location</p>
                           <p className="text-sm font-black dark:text-white">Financial District, New York</p>
                        </div>
                     </div>

                     <div className="flex items-center space-x-6 group">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                           <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Support</p>
                           <p className="text-sm font-black dark:text-white">+1 (888) FIN-FLEET</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Follow Us</h3>
                  <div className="flex space-x-3">
                    {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 hover:scale-110 transition-all shadow-xl">
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50">
               <h4 className="text-xs font-black dark:text-white uppercase tracking-widest mb-4 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                  Partnerships
               </h4>
               <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold leading-relaxed mb-6">Interested in partnering with FinFleet or integrating our tools into your institutional workflow?</p>
               <button className="text-[10px] font-black uppercase tracking-widest text-brand-600 flex items-center hover:translate-x-1 transition-transform">
                  Partner Portal <ArrowRight className="w-4 h-4 ml-2" />
               </button>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />
               
               <form onSubmit={handleSubmit} className="space-y-10 relative">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                     <input
                       required type="text" placeholder="Enter your name"
                       className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                       value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                     <input
                       required type="email" placeholder="Enter your email"
                       className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                       value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                   <input
                     required type="text" placeholder="Reason for contacting"
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
                     value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                   <textarea
                     required rows="6" placeholder="How can we help you?"
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                     value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                   ></textarea>
                 </div>

                 <button 
                   type="submit" disabled={loading}
                   className="w-full py-5 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-[0.25em] shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
                 >
                   {loading ? (
                     <>
                       <span>Sending...</span>
                       <Loader2 className="w-4 h-4 animate-spin" />
                     </>
                   ) : (
                     <>
                       <span>Send Message</span>
                       <Send className="w-4 h-4" />
                     </>
                   )}
                 </button>
               </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
