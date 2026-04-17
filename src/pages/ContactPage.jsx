import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Instagram, Linkedin, Twitter, MapPin, Phone, Send, Loader2 } from 'lucide-react';
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
      toast.success("Message sent! Our team will contact you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 dark:text-white"
          >
            Get in <span className="text-brand-600">Touch</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Have questions? We're here to help you navigate your financial education journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium p-8 h-full">
              <h3 className="text-xl font-bold dark:text-white mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl">
                    <Mail className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold dark:text-white">Email Us</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">support@finfleet.academy</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent-success/10 rounded-xl">
                    <Phone className="w-5 h-5 text-accent-success" />
                  </div>
                  <div>
                    <div className="text-sm font-bold dark:text-white">Call Us</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">+1 (888) FIN-FLEET</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold dark:text-white">Visit Us</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Financial District, New York, NY</div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="text-sm font-bold dark:text-white mb-4">Follow Our Fleet</div>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/finfleetacademy/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-brand-600 transition-colors border border-slate-100 dark:border-slate-800">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/113126241/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-brand-600 transition-colors border border-slate-100 dark:border-slate-800">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://x.com/finfleetacademy" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:text-brand-600 transition-colors border border-slate-100 dark:border-slate-800">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    required
                    rows="6"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white resize-none"
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
