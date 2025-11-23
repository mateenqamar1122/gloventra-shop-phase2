import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend API
    console.log('Form submitted:', formData);
    toast.success('Your message has been sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Contact Us</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          We'd love to hear from you! Please fill out the form below or reach out to us using the contact details provided.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">Your Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Your Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Regarding my order..."
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full rounded-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h2>

            {/* GIF Section */}
            <div className="mb-8">
              <img
                src="/contactus.gif"
                alt="Contact Us Animation"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;