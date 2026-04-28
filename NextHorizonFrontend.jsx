import React, { useState } from 'react';
import { Anchor, Mail, Phone, CreditCard, Users, FileText, Briefcase, Ship } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export default function NextHorizonCareers() {
  const [currentSection, setCurrentSection] = useState('home');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedServices: []
  });
  const [cartItems, setCartItems] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const services = [
    { id: 'registration', name: 'Job Application Registration', price: 200, description: 'Complete profile setup and job matching' },
    { id: 'medical', name: 'Medical Certification', price: 50, description: 'Maritime medical examination support' },
    { id: 'cv', name: 'International CV & Cover Letter', price: 30, description: 'Professional document preparation' },
    { id: 'revamp', name: 'CV Revamp', price: 16, description: 'Resume enhancement service' }
  ];

  const jobListings = [
    { id: 1, title: 'Cruise Ship Crew Member', company: 'Global Maritime Lines', location: 'Caribbean', salary: '$2,500-$3,500/month' },
    { id: 2, title: 'Logistics Coordinator', company: 'International Shipping Co', location: 'USA', salary: '$45,000-$55,000/year' },
    { id: 3, title: 'Ship Maintenance Officer', company: 'Ocean Voyage Services', location: 'UK', salary: '£35,000-£45,000/year' },
    { id: 4, title: 'Supply Chain Manager', company: 'Global Logistics Ltd', location: 'UAE', salary: 'AED 120,000-150,000/year' },
    { id: 5, title: 'Port Operations Manager', company: 'Harbor Services International', location: 'Singapore', salary: '$60,000-$75,000/year' },
    { id: 6, title: 'Cruise Director', company: 'Luxury Cruise Experiences', location: 'USA', salary: '$3,000-$4,500/month + tips' }
  ];

  const handleServiceSelect = (service) => {
    const isSelected = cartItems.find(item => item.id === service.id);
    if (isSelected) {
      setCartItems(cartItems.filter(item => item.id !== service.id));
    } else {
      setCartItems([...cartItems, service]);
    }
  };

  const handlePayment = async () => {
    if (!formData.fullName || !formData.email || cartItems.length === 0) {
      alert('Please fill in all required fields and select services');
      return;
    }
    // In production, integrate with Stripe Checkout
    alert(`Processing payment for ${cartItems.length} service(s). Total: $${cartItems.reduce((sum, item) => sum + item.price, 0)}`);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", margin: 0, padding: 0, backgroundColor: '#f8f9fa' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#003d5c',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Ship size={32} color="#00d4ff" />
          <span>Next Horizon Careers</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {['home', 'jobs', 'services', 'contact'].map(section => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderBottom: currentSection === section ? '3px solid #00d4ff' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00d4ff'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              {section}
            </button>
          ))}
        </div>
      </nav>

      {/* Home Section */}
      {currentSection === 'home' && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #003d5c 0%, #004d73 100%)',
            color: 'white',
            padding: '6rem 2rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Chart Your Course to Success</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your gateway to global cruise ship and logistics career opportunities</p>
            <button
              onClick={() => setCurrentSection('services')}
              style={{
                backgroundColor: '#00d4ff',
                color: '#003d5c',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get Started Now
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              { icon: <Ship size={40} />, title: 'Cruise Opportunities', desc: 'Connect with top cruise lines worldwide' },
              { icon: <Briefcase size={40} />, title: 'Logistics Jobs', desc: 'Supply chain & port management roles' },
              { icon: <Users size={40} />, title: 'Global Network', desc: 'Opportunities in UK, USA, UAE & more' },
              { icon: <FileText size={40} />, title: 'Career Support', desc: 'Professional CV & application help' }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ color: '#00d4ff', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Section */}
      {currentSection === 'jobs' && (
        <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#003d5c', marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>Current Opportunities</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {jobListings.map(job => (
              <div key={job.id} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                borderLeft: '5px solid #00d4ff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>{job.title}</h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}><strong>{job.company}</strong> • {job.location}</p>
                <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>{job.salary}</p>
                <button style={{
                  backgroundColor: '#003d5c',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#00d4ff'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#003d5c'}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services/Pricing Section */}
      {currentSection === 'services' && (
        <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#003d5c', marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>Our Services</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {services.map(service => (
              <div key={service.id} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: cartItems.find(item => item.id === service.id) ? '2px solid #00d4ff' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>{service.name}</h3>
                <p style={{ color: '#666', marginBottom: '1rem', minHeight: '2rem' }}>{service.description}</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4ff', marginBottom: '1rem' }}>${service.price}</div>
                <button
                  onClick={() => handleServiceSelect(service)}
                  style={{
                    backgroundColor: cartItems.find(item => item.id === service.id) ? '#00d4ff' : '#003d5c',
                    color: cartItems.find(item => item.id === service.id) ? '#003d5c' : 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cartItems.find(item => item.id === service.id) ? '✓ Selected' : 'Select Service'}
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              marginBottom: '3rem'
            }}>
              <h3 style={{ color: '#003d5c', marginBottom: '1rem' }}>Selected Services:</h3>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #ddd', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#003d5c', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {cartItems.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#003d5c', marginBottom: '1.5rem' }}>Complete Registration</h3>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <button
                onClick={handlePayment}
                style={{
                  backgroundColor: '#00d4ff',
                  color: '#003d5c',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <CreditCard size={20} /> Proceed to Secure Payment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contact Section */}
      {currentSection === 'contact' && (
        <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#003d5c', marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>Get in Touch</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <Phone size={40} color="#00d4ff" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>Phone</h3>
              <p style={{ color: '#666' }}>+1 (816) 827-0407</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <Mail size={40} color="#00d4ff" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>Email</h3>
              <p style={{ color: '#666' }}>nexthorizoncareers@gmail.com</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <Anchor size={40} color="#00d4ff" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#003d5c', marginBottom: '0.5rem' }}>Service Areas</h3>
              <p style={{ color: '#666' }}>UK, USA, UAE, Singapore & More</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#003d5c', marginBottom: '1.5rem' }}>Send us a Message</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input type="text" placeholder="Your Name" style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }} />
              <input type="email" placeholder="Your Email" style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }} />
              <textarea placeholder="Your Message" rows="5" style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }} />
              <button style={{
                backgroundColor: '#003d5c',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#00d4ff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#003d5c'}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#003d5c',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '3rem',
        borderTop: '3px solid #00d4ff'
      }}>
        <p>© 2024 Next Horizon Careers. All rights reserved. Charting courses to global maritime opportunities.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#aaa' }}>Secure payment processing | International support | Professional career guidance</p>
      </footer>
      <Analytics />
    </div>
  );
}
