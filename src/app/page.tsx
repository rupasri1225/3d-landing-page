"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeDLandingPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);  
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  // Button click handlers
  const handleGetStarted = () => {
    // Option 1: Scroll to a specific section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Option 2: You could also redirect to a signup/registration page
    // window.open('https://your-signup-page.com', '_blank');
    
    // Option 3: Or show a modal/form (you'd need to implement the modal)
    // setShowSignupModal(true);
    
    console.log('Get Started clicked!');
  };

  const handleLearnMore = () => {
    // Option 1: Scroll to video section
    const videoSection = document.getElementById('video');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Option 2: You could redirect to a detailed information page
    // window.open('https://your-info-page.com', '_blank');
    
    console.log('Learn More clicked!');
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff88, 0.8, 100);
    pointLight.position.set(-5, 3, 2);
    scene.add(pointLight);

    // Fallback placeholder model since we don't have the actual GLB file
    const createPlaceholderModel = () => {
      console.log('Creating placeholder model');
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1
      });

      const mesh = new THREE.Mesh(geometry, material);
      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);
      modelRef.current = group;
      setDebugInfo('Interactive 3D Model Loaded');
      setIsLoading(false);
    };

    // Create the placeholder model immediately
    createPlaceholderModel();

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
        modelRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with 3D Model */}
      <section className="relative h-screen overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-emerald-400 text-lg">{debugInfo}</p>
          </div>
        )}
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              VIGNAM
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transforming Text into Interactive Scientific Simulations
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={handleGetStarted}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Get Started
              </button>
              <button 
                onClick={handleLearnMore}
                className="border border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Floating UI Elements */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-semibold">Vignam</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="absolute top-6 right-6 z-20">
          <div className="flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">Features</a>
            <a href="#video" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">Demo</a>
            <a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">Contact</a>
          </div>
        </nav>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              See Vignam in Action
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience how our revolutionary text-to-simulation technology transforms complex scientific concepts into interactive learning experiences.
            </p>
          </div>
          
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <iframe
              src="https://www.youtube.com/embed/E1czmX6bjFA?start=10"
              title="Vignam Text to Simulations Demo"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the cutting-edge capabilities that make Vignam the future of scientific education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧪",
                title: "Text to Simulation",
                description: "Transform any scientific concept into an interactive 3D simulation with just text input."
              },
              {
                icon: "🎯",
                title: "Pre-built Library",
                description: "Access hundreds of ready-made simulations covering physics, chemistry, biology, and more."
              },
              {
                icon: "⚡",
                title: "Real-time Physics",
                description: "Experience accurate physics simulation with real-time calculations and interactions."
              },
              {
                icon: "🎨",
                title: "Visual Learning",
                description: "Enhanced understanding through immersive visual representations of complex concepts."
              },
              {
                icon: "🔬",
                title: "Scientific Accuracy",
                description: "All simulations are built with scientifically accurate models and calculations."
              },
              {
                icon: "📱",
                title: "Cross-platform",
                description: "Access your simulations anywhere, anytime, on any device with seamless synchronization."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black p-8 rounded-2xl border border-gray-800 hover:border-emerald-600 transition-all duration-300 group">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "500+", label: "Simulations" },
              { number: "50+", label: "Universities" },
              { number: "99%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-900 to-cyan-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Learning?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students who are already using Vignam to make science more engaging and accessible.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-emerald-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => {
                // You can customize this action
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border border-white text-white hover:bg-white hover:text-emerald-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 cursor-pointer"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">V</span>
              </div>
              <span className="text-xl font-semibold">Vignam</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Terms</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Support</a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400">© 2024 Vignam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThreeDLandingPage;