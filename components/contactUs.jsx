import React, { useState } from 'react';
import { Loader, CheckCircle, AlertTriangle, Send, MapPin, Phone, Mail } from 'lucide-react';

// Utility component for the submission status message
const StatusMessage = ({ type, message }) => {
  if (!message) return null;

  let Icon, colorClasses;
  if (type === 'success') {
    Icon = CheckCircle;
    colorClasses = 'bg-green-50 border-green-300 text-green-700';
  } else if (type === 'error') {
    Icon = AlertTriangle;
    colorClasses = 'bg-red-50 border-red-300 text-red-700';
  }

  return (
    <div className={`p-4 mt-6 rounded-lg border flex items-start space-x-3 transition-all duration-300 ${colorClasses}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

// WhatsApp Icon SVG (Inline)
const WhatsAppIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className={`w-6 h-6 ${className}`}
    >
        <path d="M16 .7C7.6.7.7 7.6.7 16c0 2.7.7 5.3 2 7.6L0 32l8.7-2.6c2.2 1.2 4.8 1.9 7.3 1.9 8.4 0 15.3-6.9 15.3-15.3S24.4.7 16 .7zm0 27.8c-2.3 0-4.6-.6-6.6-1.8l-.5-.3-5.2 1.6 1.7-5.1-.3-.5c-1.2-2-1.8-4.3-1.8-6.7 0-7.2 5.9-13.1 13.1-13.1s13.1 5.9 13.1 13.1-5.9 13.1-13.1 13.1zm7.7-9.8c-.4-.2-2.3-1.1-2.7-1.2-.4-.2-.7-.2-1 .2-.3.4-1.1 1.2-1.4 1.5-.3.3-.5.3-.9.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.5-.7.2-.3.1-.5 0-.7-.1-.2-1-2.4-1.4-3.3-.4-.8-.8-.7-1.1-.7h-.9c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 1.9 1.4 3.8 1.6 4.1.2.3 2.8 4.2 7 5.8 1 .4 1.7.7 2.2.9 1 .3 1.8.3 2.5.2.8-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.7-.1-.1-.4-.2-.8-.4z" />
    </svg>
);




const ContactInfo = () => {
    
    const whatsappNumber = "8801707947708"; 
    const defaultMessage = "Hello, I am reaching out from your contact page regarding an inquiry.";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

    return (
        <div id='ContactUs' className="bg-gradient-to-r from-[#0A1625] to-[#0C1A2E]  p-8 rounded-xl shadow-lg h-full">
            <h2 className="text-2xl text-white font-semibold mb-6 border-b border-gray-600 pb-3">
            Our Information
            </h2>
            <div className="space-y-6">
                
                {/* WhatsApp Link */}
                <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 bg-green-600 hover:bg-green-500 p-3 rounded-lg transition duration-150 shadow-md"
                >
                    <WhatsAppIcon className='text-white'/>
                    <div>
                        <h3 className="font-bold text-lg text-white">Chat on WhatsApp</h3>
                        <p className="text-sm text-green-100">Instant Message Support</p>
                    </div>
                </a>

                <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 flex-shrink-0 text-gray-300 mt-1" />
                    <div>
                    <h3 className="font-medium text-white text-lg">Address</h3>
                    <p className="text-gray-400">Kurcahp,Debidwar,Cumilla</p>
                    <p className="text-gray-400">Cumilla City, Dhaka City</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 flex-shrink-0 text-gray-300 mt-1" />
                    <div>
                    <h3 className="font-medium text-white text-lg">Phone</h3>
                    <p className="text-gray-400">01707947708</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 flex-shrink-0 text-gray-300 mt-1" />
                    <div>
                    <h3 className="font-medium text-white text-lg">Email</h3>
                    <p className="text-gray-400">imranhasan22mar@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Contact Us Component
const ContactUs = () => {
    
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [status, setStatus] = useState({
        message: '',
        type: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const { name, email, message } = formData;
        if (!name || !email || !message) {
            setStatus({
                type: 'error',
                message: 'Please fill out all required fields: Name, Email, and Message.',
            });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({
                type: 'error',
                message: 'Please enter a valid email address.',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Your message has been successfully sent! We will get back to you soon.',
                });
                
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                
                setStatus({
                    type: 'error',
                    message: result.message || 'Failed to send message. Please check the console for details.',
                });
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            setStatus({
                type: 'error',
                message: 'A network error occurred. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    
    const inputStyle = "w-full p-3 border border-gray-500/30 rounded-md outline-none text-gray-700 focus:border-gray-500/50 focus:ring-1 focus:ring-gray-500/30 transition duration-150";

    return (
       
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 min-h-screen"> 
            <div className="w-full max-w-5xl">
                
                {/* Header Section */}
                <div className="text-center space-y-2 mb-12">
                    <h1 className="md:text-4xl text-2xl font-medium text-gray-800">
                        Contact Our Team
                    </h1>
                    <p className="md:text-lg text-gray-500/80">
                        We're here to help! Send us a message or find our contact details below.
                    </p>
                </div>

                {/* Two-column layout for Contact Info and Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contact Info (1/3 width on large screens) */}
                    <div className="lg:col-span-1">
                        <ContactInfo />
                    </div>

                    {/* Contact Form (2/3 width on large screens) */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg lg:col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
                            Send Us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                                {/* Name Input */}
                                <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className={inputStyle}
                                    disabled={isSubmitting}
                                    required
                                />
                                </div>

                                {/* Email Input */}
                                <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={inputStyle}
                                    disabled={isSubmitting}
                                    required
                                />
                                </div>
                            </div>
                            
                            {/* Subject Input */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                                </label>
                                <input
                                id="subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Inquiry or Request"
                                className={inputStyle}
                                disabled={isSubmitting}
                                />
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                    </label>
                                </div>
                                <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you today?"
                                className={inputStyle}
                                disabled={isSubmitting}
                                required
                                ></textarea>
                            </div>

                            {/* Status Message Display */}
                            <StatusMessage type={status.type} message={status.message} />
                            
                            {/* Submit Button - Styled to match the original dark grey button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-100 bg-gradient-to-r from-[#0A1625] to-[#0C1A2E] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                                ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Send Message</span>
                                </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;