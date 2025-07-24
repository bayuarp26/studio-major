'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Globe, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import type { Locale } from '../../../i18n.config';

interface ContactProjectProps {
  dictionary: any;
  contact: {
    email: string;
    linkedin: string;
  };
  name: string;
  lang: Locale;
}

export default function ContactProject({ dictionary, contact, name, lang }: ContactProjectProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, lang }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <Card className="max-w-6xl mx-auto bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Contact Info */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 lg:p-12 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  {dictionary?.contact?.title || (lang === 'id' ? 'Mari diskusikan proyek Anda' : "Let's discuss your Project")}
                </h2>
                <p className="text-purple-100 mb-8 leading-relaxed">
                  {dictionary?.contact?.description || (lang === 'id' ? 'Saya terbuka untuk peluang dan kolaborasi baru. Jangan ragu untuk menghubungi saya!' : 'I am open to new opportunities and collaborations. Feel free to contact me!')}
                </p>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Work Location</h4>
                      <p className="text-purple-100 text-sm">Remote Work or On-Site Available</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">My Email</h4>
                      <p className="text-purple-100 text-sm">{contact.email || "contact@example.com"}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Let's Connect</h4>
                      <p className="text-purple-100 text-sm">+62 822-8651-4244</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <div className="flex gap-4">
                    <a 
                      href="https://www.wahyupratomo.my.id" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </a>
                    <a 
                      href="https://www.instagram.com/analogi.bayu/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    {contact.linkedin && (
                      <a 
                        href="https://www.linkedin.com/in/wahyupratomo26/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="p-8 lg:p-12">
                <p className="text-gray-600 mb-8">
                  {lang === 'id' 
                    ? 'Hubungi saya untuk mendiskusikan proyek atau peluang kolaborasi yang menarik. Saya siap membantu mewujudkan ide digital Anda.'
                    : 'Contact me to discuss exciting projects or collaboration opportunities. I\'m ready to help bring your digital ideas to life.'
                  }
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder={dictionary?.contact?.name || (lang === 'id' ? 'Nama*' : 'Name*')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder={dictionary?.contact?.email || 'Email*'}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Textarea
                      name="message"
                      placeholder={dictionary?.contact?.message || (lang === 'id' ? 'Pesan*' : 'Message*')}
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg px-8 py-3 font-medium transition-colors"
                  >
                    {isSubmitting 
                      ? (dictionary?.contact?.sending || (lang === 'id' ? 'Mengirim...' : 'Sending...'))
                      : (dictionary?.contact?.send || (lang === 'id' ? 'Kirim' : 'Submit'))
                    }
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✅ {dictionary?.contact?.success || (lang === 'id' 
                          ? 'Terima kasih! Pesan Anda berhasil dikirim. Saya akan segera membalas.'
                          : 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.'
                        )}
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        ❌ {dictionary?.contact?.error || (lang === 'id'
                          ? 'Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi saya langsung.'
                          : 'Sorry, there was an error sending your message. Please try again or contact me directly.'
                        )}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
