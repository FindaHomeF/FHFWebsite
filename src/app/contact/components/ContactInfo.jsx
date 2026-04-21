"use client"
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+234 813 531 8003'],
      action: 'tel:+2348135318003'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@findahomefuta.com', 'support@findahomefuta.com'],
      action: 'mailto:info@findahomefuta.com'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM'],
      action: null
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Get In Touch
        </h2>
        <p className="text-gray-600 mt-2">
          Multiple ways to reach our support team. We're always here to assist you.
        </p>
      </div>

      {/* Contact Details */}
      <div className="space-y-6">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-grayBg rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {item.title}
              </h3>
              {item.details.map((detail, idx) => (
                item.action ? (
                  <a
                    key={idx}
                    href={item.action}
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    {detail}
                  </a>
                ) : (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Connect With Us
        </h3>
        <div className="flex items-center gap-4">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
              aria-label={social.label}
            >
              <social.icon className="text-primary group-hover:text-white transition-colors" size={20} />
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  )
}

export default ContactInfo

