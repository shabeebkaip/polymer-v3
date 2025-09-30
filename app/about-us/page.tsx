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
  MessageCircle,
} from 'lucide-react';

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 animate-fade-in-up">
      {/* Hero Section - Modern and Engaging */}
      <section className="relative w-full flex flex-col items-center justify-center text-center py-16 md:py-24 bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              fill="#3DB2A2"
              fillOpacity="0.08"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Image
            src="/typography.svg"
            alt="Polymers Hub Logo"
            width={140}
            height={48}
            className="mx-auto mb-2 drop-shadow-lg"
          />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-gradient drop-shadow-md">
            Empowering Polymer Trade
          </h1>
          <p className="text-gray-700 text-lg sm:text-2xl md:text-3xl max-w-2xl mt-4 font-medium animate-fade-in-up-delayed">
            The trusted digital marketplace for the global polymer industry. We connect buyers and
            suppliers worldwide, making polymer sourcing and trading seamless, secure, and
            efficient.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in-up-delayed-2">
            <div className="bg-white/90 border border-green-100 rounded-xl px-6 py-4 flex flex-col items-center shadow hover:shadow-lg transition-all duration-300 min-w-[140px]">
              <span className="text-green-700 text-2xl font-bold">10,000+</span>
              <span className="text-gray-600 text-sm font-medium">Polymer Products</span>
            </div>
            <div className="bg-white/90 border border-green-100 rounded-xl px-6 py-4 flex flex-col items-center shadow hover:shadow-lg transition-all duration-300 min-w-[140px]">
              <span className="text-green-700 text-2xl font-bold">500+</span>
              <span className="text-gray-600 text-sm font-medium">Verified Suppliers</span>
            </div>
            <div className="bg-white/90 border border-green-100 rounded-xl px-6 py-4 flex flex-col items-center shadow hover:shadow-lg transition-all duration-300 min-w-[140px]">
              <span className="text-green-700 text-2xl font-bold">50+</span>
              <span className="text-gray-600 text-sm font-medium">Countries Served</span>
            </div>
            <div className="bg-white/90 border border-green-100 rounded-xl px-6 py-4 flex flex-col items-center shadow hover:shadow-lg transition-all duration-300 min-w-[140px]">
              <span className="text-green-700 text-2xl font-bold">24/7</span>
              <span className="text-gray-600 text-sm font-medium">Expert Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Vision, Mission, Values */}
      <section className="container mx-auto px-4 py-14 flex flex-col items-center text-center gap-12">
        <div className="flex flex-col items-center gap-6 animate-fade-in-up w-full max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2 tracking-tight">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            To be the world’s most trusted and innovative digital marketplace for polymers, enabling
            sustainable growth and global collaboration across the industry. We envision a future
            where every business, regardless of size or location, can access quality materials and
            new opportunities with confidence and ease.
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 animate-fade-in-up-delayed w-full max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2 tracking-tight">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            To revolutionize the polymer industry by providing a transparent, secure, and efficient
            platform that connects buyers and suppliers worldwide. Headquartered in Riyadh, Saudi
            Arabia, we empower our users with technology, expertise, and a global network to
            accelerate their business and drive industry progress.
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 animate-fade-in-up-delayed-2 w-full max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2 tracking-tight">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Integrity</span>
              <p className="text-gray-600 text-base">
                We uphold the highest standards of honesty and transparency in every interaction.
              </p>
            </div>
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <Sparkles className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Innovation</span>
              <p className="text-gray-600 text-base">
                We embrace change and continuously improve our platform to deliver the best
                experience.
              </p>
            </div>
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <User className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Customer Focus</span>
              <p className="text-gray-600 text-base">
                Our users are at the heart of everything we do. We listen, adapt, and deliver value.
              </p>
            </div>
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <Users className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Collaboration</span>
              <p className="text-gray-600 text-base">
                We foster partnerships and teamwork to achieve shared success across the industry.
              </p>
            </div>
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <Leaf className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Sustainability</span>
              <p className="text-gray-600 text-base">
                We are committed to responsible practices that support a greener, more sustainable
                future.
              </p>
            </div>
            <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
              <Award className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-green-700 text-xl font-bold">Excellence</span>
              <p className="text-gray-600 text-base">
                We strive for excellence in every aspect of our service, from technology to support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Modern Cards with Icons */}
      <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700">Why Choose Polymers Hub?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-4">
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">Verified Suppliers</h3>
            <p className="text-gray-600 text-sm">
              All suppliers are thoroughly vetted to ensure quality and reliability for every
              transaction.
            </p>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <Globe className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">Global Network</h3>
            <p className="text-gray-600 text-sm">
              Connect with buyers and sellers from over 50 countries, expanding your reach and
              opportunities.
            </p>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <Star className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">24/7 Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Our dedicated team is always available to assist you with any queries or support you
              need.
            </p>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">Secure Transactions</h3>
            <p className="text-gray-600 text-sm">
              State-of-the-art security ensures your data and payments are always protected.
            </p>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">Innovation</h3>
            <p className="text-gray-600 text-sm">
              We constantly evolve our platform to bring you the latest in digital trading
              technology.
            </p>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-3 backdrop-blur-md">
            <Leaf className="w-8 h-8 text-green-600 mb-1" />
            <h3 className="text-lg font-semibold text-green-700">Sustainability</h3>
            <p className="text-gray-600 text-sm">
              We promote responsible sourcing and trading to support a sustainable future for the
              polymer industry.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section - Modern Cards */}
      <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mt-4">
          <div className="flex flex-col items-center gap-3 bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <Image
              src="/assets/about-illustration.svg"
              alt="Faisal Al Saud"
              width={80}
              height={80}
              className="rounded-full border-2 border-green-200 group-hover:scale-105 transition-transform duration-200"
            />
            <h3 className="text-lg font-semibold text-green-700">Ahmed Al Johani</h3>
            <span className="text-gray-600 text-sm">Founder & CEO</span>
            <div className="flex gap-2 mt-2">
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <Image
              src="/assets/about-illustration.svg"
              alt="Layla Al Rashid"
              width={80}
              height={80}
              className="rounded-full border-2 border-green-200 group-hover:scale-105 transition-transform duration-200"
            />
            <h3 className="text-lg font-semibold text-green-700">Fasal</h3>
            <span className="text-gray-600 text-sm">Chief Technology Officer</span>
            <div className="flex gap-2 mt-2">
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <Image
              src="/assets/about-illustration.svg"
              alt="Omar Al Harbi"
              width={80}
              height={80}
              className="rounded-full border-2 border-green-200 group-hover:scale-105 transition-transform duration-200"
            />
            <h3 className="text-lg font-semibold text-green-700">Shabeeb</h3>
            <span className="text-gray-600 text-sm">Head of Operations</span>
            <div className="flex gap-2 mt-2">
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-600 hover:text-emerald-600">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Cards */}
      <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mt-4">
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-green-600 mb-1" />
            <p className="text-gray-700 text-base italic">
              “Polymers Hub made sourcing raw materials so much easier and more reliable. The
              support team is fantastic!”
            </p>
            <span className="text-green-700 font-semibold mt-2">- S. Kumar, Buyer</span>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-green-600 mb-1" />
            <p className="text-gray-700 text-base italic">
              “We expanded our business to new countries thanks to the global reach of this
              platform.”
            </p>
            <span className="text-green-700 font-semibold mt-2">- L. Chen, Supplier</span>
          </div>
          <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg flex flex-col items-center gap-3 backdrop-blur-md">
            <User className="w-8 h-8 text-green-600 mb-1" />
            <p className="text-gray-700 text-base italic">
              “The transaction process is secure and transparent. Highly recommended for anyone in
              the polymer industry.”
            </p>
            <span className="text-green-700 font-semibold mt-2">- M. Singh, Distributor</span>
          </div>
        </div>
      </section>

      {/* Contact & Address Section - Saudi Context */}
      <section className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700">Contact & Headquarters</h2>
        <div className="flex flex-col items-center gap-3 bg-white/80 border border-green-100 rounded-2xl p-6 shadow-lg w-full max-w-xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-2">
            <MapPin className="w-6 h-6 text-green-600" />
            <span className="text-gray-700 text-base font-medium">
              Riyadh, Kingdom of Saudi Arabia
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <Mail className="w-6 h-6 text-green-600" />
            <span className="text-gray-700 text-base font-medium">info@polymershub.sa</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Phone className="w-6 h-6 text-green-600" />
            <span className="text-gray-700 text-base font-medium">+966 11 123 4567</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
