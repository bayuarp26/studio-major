import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, MessageCircle, Mail, User } from 'lucide-react';

interface ContactFormProps {
  dictionary: any;
}

export default function ContactForm({ dictionary }: ContactFormProps) {
  return (
    <section id="contact-form" className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Contact
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Let's discuss your project
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Ready to bring your ideas to life? Let's collaborate and create something amazing together. Get in touch and let's start the conversation.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">hello@yourname.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input 
                        type="email"
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input 
                    className="h-12 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Project Discussion"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea 
                    className="min-h-[120px] border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 transition-all duration-300 hover:scale-105"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
