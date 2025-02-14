
import React, { useState, useEffect } from 'react';
import { 
  Mail, Moon, Sun, ArrowRight, BrainCircuit, Video, 
  Newspaper, Send, ArrowLeft, GraduationCap, Globe, 
  BookOpen, Phone, Github, Twitter, Linkedin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-r from-violet-300/30 via-pink-300/30 to-purple-300/30 dark:from-violet-900/30 dark:via-pink-900/30 dark:to-purple-900/30 animate-gradient bg-[length:400%_400%]" />
  </div>
);

// Sign Up Modal Component
const SignUpModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const handleSocialLogin = (platform: string) => {
    window.open({
      'twitter': 'https://twitter.com/login',
      'linkedin': 'https://linkedin.com/login',
      'google': 'https://google.com'
    }[platform], '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className={`w-full max-w-md m-4 relative z-10 animate-slideUp ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Join ResearchDigest</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
          </div>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <Input className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`} placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`} placeholder="john@example.com" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <Input type="password" className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`} />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transition-all duration-300">
              Create Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full hover:scale-105 transition-transform" onClick={() => handleSocialLogin('google')}>
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="w-full hover:scale-105 transition-transform" onClick={() => handleSocialLogin('twitter')}>
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              </Button>
              <Button variant="outline" className="w-full hover:scale-105 transition-transform" onClick={() => handleSocialLogin('linkedin')}>
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <AnimatedBackground />
        
        {/* Navigation */}
        <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">ResearchDigest</span>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('about')}
                  className="hover:scale-105 transition-transform"
                >
                  About
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection('features')}
                  className="hover:scale-105 transition-transform"
                >
                  Features
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="rounded-full hover:scale-110 transition-transform"
                >
                  {isDarkMode ? 
                    <Sun className="h-5 w-5 animate-spin-slow" /> : 
                    <Moon className="h-5 w-5 animate-spin-slow" />
                  }
                </Button>
                <Button
                  onClick={() => setIsSignUpOpen(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="relative pt-20 pb-32 flex items-center min-h-screen">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Stay ahead with daily
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 animate-gradient bg-[length:400%_400%]">
                  research insights
                </span>
              </h1>
              <p className="text-xl mb-12 text-gray-600 dark:text-gray-300">
                Join thousands of researchers worldwide receiving AI-powered
                <br />
                video summaries of the latest research papers
              </p>
              <Button 
                onClick={() => setIsSignUpOpen(true)}
                size="lg"
                className="group bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                Try for free
                <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-8">About ResearchDigest</h2>
              <p className="text-lg mb-12 text-gray-600 dark:text-gray-300">
                We transform complex research papers into engaging video summaries, making it easier for researchers 
                to stay updated with the latest developments in their field. Our AI-powered platform processes thousands 
                of papers daily to bring you the most relevant insights.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className={`p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To make research accessible and engaging for everyone in academia and industry.
                  </p>
                </Card>
                <Card className={`p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To revolutionize how researchers stay updated with cutting-edge developments.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className={`p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <BrainCircuit className="w-12 h-12 mb-4 text-violet-500" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Advanced algorithms process thousands of papers daily</p>
              </Card>
              <Card className={`p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <Video className="w-12 h-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">Video Summaries</h3>
                <p className="text-gray-600 dark:text-gray-300">Engaging video content from complex research papers</p>
              </Card>
              <Card className={`p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <Newspaper className="w-12 h-12 mb-4 text-pink-500" />
                <h3 className="text-xl font-bold mb-2">Daily Updates</h3>
                <p className="text-gray-600 dark:text-gray-300">Fresh research content delivered every day</p>
              </Card>
              <Card className={`p-6 transform transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <Send className="w-12 h-12 mb-4 text-violet-500" />
                <h3 className="text-xl font-bold mb-2">Email Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300">Convenient delivery straight to your inbox</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Sign Up Modal */}
        <SignUpModal 
          isOpen={isSignUpOpen} 
          onClose={() => setIsSignUpOpen(false)} 
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Index;
