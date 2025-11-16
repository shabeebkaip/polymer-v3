"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+966 537 346 577", "+966 XXX XXX XXX"],
      color: "bg-blue-500",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@polymershub.com", "support@polymershub.com"],
      color: "bg-green-500",
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Riyadh, Saudi Arabia", "King Fahd Road"],
      color: "bg-orange-500",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Sunday - Thursday", "9:00 AM - 6:00 PM"],
      color: "bg-purple-500",
    },
  ];

  const subjects = [
    "General Inquiry",
    "Product Information",
    "Partnership Opportunity",
    "Technical Support",
    "Quote Request",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.3)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(255,255,255,0.3)_0%,_transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="+966 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Contact Us */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Why Contact Us?
              </h3>
              <ul className="space-y-3">
                {[
                  "Expert consultation",
                  "Quick response time",
                  "Tailored solutions",
                  "24/7 support available",
                  "Free quotes",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9470193820643!2d46.67175931500273!3d24.713551984129583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Visit Our Office</h4>
                <p className="text-gray-600 text-sm">
                  King Fahd Road, Riyadh, Saudi Arabia
                </p>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg border border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Quick Response
                </h3>
                <p className="text-gray-700 text-sm">
                  Our team typically responds within 2-4 hours during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find quick answers to common questions below
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What are your business hours?",
                answer: "We're open Sunday through Thursday, 9:00 AM to 6:00 PM (Saudi Arabia time).",
              },
              {
                question: "How quickly will I receive a response?",
                answer: "We aim to respond to all inquiries within 2-4 hours during business hours.",
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship globally. Contact us for specific shipping details and rates.",
              },
              {
                question: "Can I schedule a consultation?",
                answer: "Absolutely! Mention your preferred time in the message and we'll arrange it.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
