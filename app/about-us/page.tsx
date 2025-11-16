import React from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Users,
  ShieldCheck,
  Globe,
  Award,
  Leaf,
  Sparkles,
  Star,
} from 'lucide-react';

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-primary-500 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/onlylogo.png"
                alt="Polymers Hub Icon"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <Image
                src="/typography.svg"
                alt="Polymers Hub"
                width={180}
                height={48}
                className="h-8 md:h-10 w-auto brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connecting the Global<br />Polymer Industry
            </h1>
            <p className="text-lg sm:text-xl text-primary-50 max-w-2xl mx-auto mb-10 leading-relaxed">
              The premier digital marketplace empowering polymer trade across Saudi Arabia, the GCC, and beyond. 
              We make sourcing and selling polymers seamless, secure, and efficient.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-primary-50">Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-primary-50">Suppliers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-primary-50">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-primary-50">Support</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          <div className="bg-primary-50 rounded-3xl p-8 md:p-10 border border-primary-500/20">
            <div className="bg-primary-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be the world's most trusted and innovative digital marketplace for polymers, enabling
              sustainable growth and global collaboration. We envision a future where every business
              can access quality materials and opportunities with confidence.
            </p>
          </div>
          <div className="bg-primary-50 rounded-3xl p-8 md:p-10 border border-primary-500/20">
            <div className="bg-primary-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              To revolutionize the polymer industry by providing a transparent, secure, and efficient
              platform connecting buyers and suppliers worldwide. Based in Riyadh, we empower businesses
              with technology, expertise, and a global network.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                We uphold the highest standards of honesty and transparency in every interaction.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We embrace change and continuously improve our platform to deliver the best experience.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Our users are at the heart of everything we do. We listen, adapt, and deliver value.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                We foster partnerships and teamwork to achieve shared success across the industry.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to responsible practices that support a greener, more sustainable future.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every aspect of our service, from technology to support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Polymers Hub?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The platform built for the modern polymer industry
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Suppliers</h3>
            <p className="text-gray-600 leading-relaxed">
              All suppliers are thoroughly vetted to ensure quality and reliability for every transaction.
            </p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with buyers and sellers from over 50 countries, expanding your reach and opportunities.
            </p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Expert Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Our dedicated team is always available to assist you with any queries or support you need.
            </p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Transactions</h3>
            <p className="text-gray-600 leading-relaxed">
              State-of-the-art security ensures your data and payments are always protected.
            </p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600 leading-relaxed">
              We constantly evolve our platform to bring you the latest in digital trading technology.
            </p>
          </div>
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500/30">
            <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
            <p className="text-gray-600 leading-relaxed">
              We promote responsible sourcing and trading to support a sustainable future for the polymer industry.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by businesses across the polymer industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
                "Polymers Hub made sourcing raw materials so much easier and more reliable. The
                support team is fantastic!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">S. Kumar</div>
                  <div className="text-sm text-gray-500">Buyer, Manufacturing</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
                "We expanded our business to new countries thanks to the global reach of this
                platform. Game changer for us!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">L. Chen</div>
                  <div className="text-sm text-gray-500">Supplier, Petrochemicals</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
                "The transaction process is secure and transparent. Highly recommended for anyone in
                the polymer industry."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">M. Singh</div>
                  <div className="text-sm text-gray-500">Distributor, Polymers</div>
                </div>
              </div>
            </div>
          </div>
                </div>
      </section>      {/* Testimonials Section - Modern Cards */}
      <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-500">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mt-4">
          <div className="bg-white/80 border border-primary-500/20 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-primary-500 mb-1" />
            <p className="text-gray-700 text-base italic">
              "Polymers Hub made sourcing raw materials so much easier and more reliable. The
              support team is fantastic!"
            </p>
            <span className="text-primary-500 font-semibold mt-2">- S. Kumar, Buyer</span>
          </div>
          <div className="bg-white/80 border border-primary-500/20 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-primary-500 mb-1" />
            <p className="text-gray-700 text-base italic">
              "We expanded our business to new countries thanks to the global reach of this
              platform."
            </p>
            <span className="text-primary-500 font-semibold mt-2">- L. Chen, Supplier</span>
          </div>
          <div className="bg-white/80 border border-primary-500/20 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-primary-500 mb-1" />
            <p className="text-gray-700 text-base italic">
              "The transaction process is secure and transparent. Highly recommended for anyone in
              the polymer industry."
            </p>
            <span className="text-primary-500 font-semibold mt-2">- M. Singh, Distributor</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions? We're here to help you succeed
            </p>
          </div>
          <div className="bg-primary-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Headquarters</h3>
                <p className="text-primary-50">Riyadh, Kingdom of Saudi Arabia</p>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <a href="mailto:info@polymershub.sa" className="text-primary-50 hover:text-white transition-colors">
                  info@polymershub.sa
                </a>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Phone</h3>
                <a href="tel:+966111234567" className="text-primary-50 hover:text-white transition-colors">
                  +966 11 123 4567
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-center">
              <p className="text-primary-50 mb-4">Ready to transform your polymer business?</p>
              <a
                href="/auth/register"
                className="inline-block bg-white text-primary-500 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
