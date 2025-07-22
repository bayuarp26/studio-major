'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Facebook, Globe, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";

interface ContactProjectProps {
  dictionary: any;
  contact: {
    email: string;
    linkedin: string;
  };
  name: string;
}

export default function ContactProject({ dictionary, contact, name }: ContactProjectProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="container">
        <Card className="max-w-6xl mx-auto bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Contact Info */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 lg:p-12 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Let's discuss your Project
                </h2>
                <p className="text-purple-100 mb-8 leading-relaxed">
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
                </p>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-purple-100 text-sm">Remote Work Available</p>
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
                      <p className="text-purple-100 text-sm">Available for consultation</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center hover:bg-purple-400 transition-colors cursor-pointer">
                      <Facebook className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    {contact.linkedin && (
                      <a 
                        href={contact.linkedin} 
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
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alte.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name*"
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
                      placeholder="Email*"
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
                      placeholder="Message*"
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
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 py-3 font-medium transition-colors"
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
