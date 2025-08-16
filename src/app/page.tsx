"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced 3D Model Component
const IndustrialModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [models, setModels] = useState<THREE.Group[]>([]);

  useEffect(() => {
    // Create multiple industrial components
    const createIndustrialPart = (type: 'cylinder' | 'gear' | 'bearing' | 'housing') => {
      const group = new THREE.Group();
      
      if (type === 'cylinder') {
        const mainCylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5, 1.5, 3, 32),
          new THREE.MeshStandardMaterial({
            color: 0xa0a0a0,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 2
          })
        );
        
        const topRing = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.15, 8, 32),
          new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            metalness: 0.95,
            roughness: 0.05
          })
        );
        topRing.position.y = 1.4;
        
        const bottomRing = topRing.clone();
        bottomRing.position.y = -1.4;
        
        // Center bore
        const bore = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 0.8, 3.2, 24),
          new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.3,
            roughness: 0.9
          })
        );
        
        group.add(mainCylinder, topRing, bottomRing, bore);
      } else if (type === 'gear') {
        // Create gear teeth
        const gearShape = new THREE.Shape();
        const radius = 1.2;
        const teeth = 20;
        
        for (let i = 0; i < teeth; i++) {
          const angle = (i / teeth) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) gearShape.moveTo(x, y);
          else gearShape.lineTo(x, y);
          
          // Add tooth
          const toothAngle = angle + Math.PI / teeth;
          const toothX = Math.cos(toothAngle) * (radius + 0.2);
          const toothY = Math.sin(toothAngle) * (radius + 0.2);
          gearShape.lineTo(toothX, toothY);
        }
        
        const gearGeometry = new THREE.ExtrudeGeometry(gearShape, {
          depth: 0.3,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05
        });
        
        const gear = new THREE.Mesh(
          gearGeometry,
          new THREE.MeshStandardMaterial({
            color: 0x8a8a8a,
            metalness: 0.9,
            roughness: 0.2
          })
        );
        
        group.add(gear);
      }
      
      return group;
    };

    const cylinder = createIndustrialPart('cylinder');
    cylinder.position.set(0, 0, 0);
    
    const gear1 = createIndustrialPart('gear');
    gear1.position.set(2.5, 1, 1);
    gear1.rotation.x = Math.PI / 2;
    
    const gear2 = createIndustrialPart('gear');
    gear2.position.set(-2.5, -1, 1);
    gear2.rotation.z = Math.PI / 4;
    
    setModels([cylinder, gear1, gear2]);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      
      // Animate individual parts
      models.forEach((model, index) => {
        if (model) {
          model.rotation.z += 0.01 * (index + 1);
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {models.map((model, index) => (
        <primitive key={index} object={model} />
      ))}
    </group>
  );
};

// Floating particles for industrial atmosphere
const FloatingParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial color="#4a90e2" size={0.02} transparent opacity={0.6} />
    </points>
  );
};

// Loading component
const Loader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-blue-300 mt-4 font-medium">Loading Forge Experience...</p>
    </div>
  </div>
);

const ForgeManufacturing: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setCurrentSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle Get Quote button
  const handleGetQuote = () => {
    // You can replace this with your actual quote form/modal logic
    alert("Quote form will open here. Replace this with your actual quote functionality.");
  };

  return (
    <div className="bg-slate-900 text-white overflow-hidden">
      {!isLoaded && <Loader />}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  FORGE
                </span>
                <div className="text-xs text-slate-400">Precision Manufacturing</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Solutions', id: 'solutions' },
                { name: 'Products', id: 'products' },
                { name: 'Technology', id: 'technology' },
                { name: 'About', id: 'about' }
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer"
                >
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></div>
                </button>
              ))}
              <button 
                onClick={handleGetQuote}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 rounded-full hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 space-y-4">
              {[
                { name: 'Solutions', id: 'solutions' },
                { name: 'Products', id: 'products' },
                { name: 'Technology', id: 'technology' },
                { name: 'About', id: 'about' }
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-slate-300 hover:text-blue-400 transition-colors py-2"
                >
                  {item.name}
                </button>
              ))}
              <button 
                onClick={handleGetQuote}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 rounded-full hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 mt-4"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <PerspectiveCamera makeDefault position={[0, 2, 8]} />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, 5, 5]} intensity={0.8} color="#4a90e2" />
            <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.3} penumbra={0.5} color="#00d4ff" />
            
            <Suspense fallback={null}>
              <IndustrialModel />
              <FloatingParticles />
              <Environment preset="warehouse" />
            </Suspense>
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">Industry 4.0 Ready</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    NEXT-GEN
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    MANUFACTURING
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                  Revolutionary precision manufacturing with AI-driven automation. 
                  From concept to production in record time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('products')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Start Production
                </button>
                <button 
                  onClick={() => scrollToSection('video')}
                  className="border-2 border-slate-600 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                >
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">99.8%</div>
                  <div className="text-slate-400 text-sm">Precision Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">24h</div>
                  <div className="text-slate-400 text-sm">Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">10K+</div>
                  <div className="text-slate-400 text-sm">Parts/Month</div>
                </div>
              </div>
            </div>

            {/* Right side info panel */}
            <div className="lg:justify-self-end">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-md">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Ayrton Senna</h3>
                    <p className="text-slate-400 text-sm">Chief Technology Officer</p>
                  </div>
                </div>
                
                <blockquote className="text-slate-300 leading-relaxed mb-6">
                  "At Forge, we're not just manufacturing partsâ€”we're engineering the future. 
                  Our AI-driven precision and lightning-fast delivery are revolutionizing how 
                  industries approach production."
                </blockquote>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Trusted by</span>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Complete <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              End-to-end manufacturing solutions tailored to your industry needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "ðŸ­",
                title: "Automotive",
                description: "High-precision components for automotive industry",
                features: ["Engine parts", "Transmission components", "Custom tooling"]
              },
              {
                icon: "âœˆï¸",
                title: "Aerospace",
                description: "Mission-critical parts for aerospace applications",
                features: ["Turbine components", "Structural parts", "Certified materials"]
              },
              {
                icon: "âš•ï¸",
                title: "Medical",
                description: "Biocompatible devices and surgical instruments",
                features: ["Implants", "Surgical tools", "FDA compliant"]
              },
              {
                icon: "ðŸ”¬",
                title: "Research",
                description: "Custom prototypes for R&D and testing",
                features: ["Rapid prototyping", "Custom materials", "Quick iterations"]
              }
            ].map((solution, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                <p className="text-slate-300 mb-4 text-sm">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-400 text-xs">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vignam in Action
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience our revolutionary text-to-simulation technology transforming 
              scientific concepts into interactive learning experiences.
            </p>
          </div>
          
          <div className="relative aspect-video bg-slate-900/50 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl">
            <iframe
              src="https://www.youtube.com/embed/E1czmX6bjFA?start=10"
              title="Vignam Text to Simulations Demo"
              className="w-full h-full rounded-3xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 px-6 bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Advanced <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Technology</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Cutting-edge manufacturing technology powered by AI and automation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                  AI-Powered Manufacturing
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Our proprietary AI algorithms optimize tool paths, predict maintenance needs, 
                  and ensure consistent quality across all production runs.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                  Real-Time Monitoring
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Advanced sensors and IoT integration provide real-time insights into 
                  every aspect of the manufacturing process.
                </p>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></span>
                  Digital Twin Technology
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Virtual replicas of our manufacturing processes enable predictive 
                  maintenance and process optimization.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20">
              <div className="text-center">
                <div className="text-6xl mb-6">ðŸ¤–</div>
                <h3 className="text-3xl font-bold text-white mb-4">Industry 4.0 Ready</h3>
                <p className="text-slate-300 mb-8">
                  Fully automated production lines with seamless integration 
                  to your existing systems and workflows.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400">150%</div>
                    <div className="text-slate-400 text-sm">Efficiency Increase</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-400">95%</div>
                    <div className="text-slate-400 text-sm">Waste Reduction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="products" className="py-20 px-6 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Precision <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Engineering</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Advanced manufacturing solutions powered by cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "âš™ï¸",
                title: "CNC Machining",
                description: "Ultra-precision CNC machining with tolerances down to Â±0.001mm",
                specs: ["5-axis capability", "24/7 operation", "Real-time monitoring"]
              },
              {
                icon: "ðŸ­",
                title: "3D Printing",
                description: "Industrial-grade additive manufacturing for rapid prototyping",
                specs: ["Metal & polymer", "Complex geometries", "Fast turnaround"]
              },
              {
                icon: "ðŸ”¬",
                title: "Quality Control",
                description: "AI-powered inspection ensuring 99.8% precision accuracy",
                specs: ["Automated inspection", "Real-time feedback", "Full traceability"]
              }
            ].map((service, index) => (
              <div key={index} className="group relative">
                <div className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.specs.map((spec, i) => (
                      <li key={i} className="flex items-center text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold mb-6 text-white">
                  About <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Forge</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                  Founded in 2018, Forge has revolutionized the manufacturing industry 
                  through innovative technology and unwavering commitment to precision.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our team of engineers, technicians, and industry experts work together 
                  to deliver manufacturing solutions that exceed expectations. We combine 
                  traditional craftsmanship with cutting-edge technology to create parts 
                  that meet the most demanding specifications.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                  <div className="text-slate-400 text-sm">Expert Engineers</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">6</div>
                  <div className="text-slate-400 text-sm">Years of Excellence</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">500K+</div>
                  <div className="text-slate-400 text-sm">Parts Delivered</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
                  <div className="text-slate-400 text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50">
              <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
              <blockquote className="text-slate-300 leading-relaxed mb-8 italic">
                "To democratize access to precision manufacturing through technology, 
                making high-quality production accessible to businesses of all sizes 
                while maintaining the highest standards of quality and delivery."
              </blockquote>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Innovation-driven approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Sustainable manufacturing practices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300">Client-centric solutions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">Continuous improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 via-slate-900 to-cyan-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 text-white">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Manufacturing?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join industry leaders who trust Forge for precision manufacturing and rapid delivery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleGetQuote}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Your Project
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="border-2 border-slate-400 px-12 py-4 rounded-xl text-lg font-semibold hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  FORGE
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Revolutionizing manufacturing with precision, speed, and innovation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">CNC Machining</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">3D Printing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Quality Control</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Prototyping</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">About</button></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">News</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-700">
            <p className="text-slate-400">Â© 2024 Forge Manufacturing. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgeManufacturing;
