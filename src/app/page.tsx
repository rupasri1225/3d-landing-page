"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation Variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Reusable component for scroll-triggered animations
const AnimatedSection: React.FC<{ children: React.ReactNode; id?: string; className?: string }> = ({ children, id, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15, // Trigger animation when 15% of the section is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial="initial"
      animate={controls}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  );
};

// 3D Model Component
const MotorModel: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    // This creates a placeholder model
    const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8c8c8c, metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5
    });
    const cylinder = new THREE.Mesh(geometry, material);
    const detailGeometry1 = new THREE.TorusGeometry(1.3, 0.1, 8, 16);
    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, metalness: 0.8, roughness: 0.2
    });
    const detail1 = new THREE.Mesh(detailGeometry1, detailMaterial);
    detail1.position.y = 0.3;
    const detail2 = new THREE.Mesh(detailGeometry1, detailMaterial);
    detail2.position.y = -0.3;
    const holeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.9, 16);
    const holeMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c2c2c, metalness: 0.3, roughness: 0.8
    });
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    const group = new THREE.Group();
    group.add(cylinder, detail1, detail2, hole);
    group.scale.setScalar(0.8);
    setModel(group);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (!model) return null;
  return (<group ref={meshRef}><primitive object={model} /></group>);
};

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-500"></div>
  </div>
);

// Main component
const ForgeManufacturingLanding: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">Forge</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#manufacture" className="text-slate-700 hover:text-indigo-600 transition-colors">Manufacture</a>
              <a href="#video" className="text-slate-700 hover:text-indigo-600 transition-colors">Our Process</a>
              <a href="#contact" className="text-slate-700 hover:text-indigo-600 transition-colors">Get in touch</a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp}>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                  Revolutionizing
                  <br />
                  Manufacturing with
                  <br />
                  Speed and <span className="text-slate-500 italic">Precision</span>
                </h1>
              </motion.div>
              {/* Navigation List */}
              <motion.div variants={staggerContainer} className="space-y-4 mt-12">
                {[
                  { title: 'Custom Brackets', icon: '🔧' }, { title: 'Steel Adapters', icon: '⚙️' },
                  { title: 'Motor Mounts', icon: '🏭' }, { title: 'Enclosures', icon: '📦' }
                ].map((item, index) => (
                  <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <span className="text-indigo-600 font-mono">0{index + 1}</span>
                        <span className="font-medium text-slate-900">{item.title}</span>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"><span className="text-xs">{item.icon}</span></div>
                        <span className="text-slate-400">→</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Right Content - 3D Model */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} className="relative h-[600px] lg:h-[700px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl"></div>
              {isLoading ? <LoadingSpinner /> : (
                <Canvas className="absolute inset-0">
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
                  <Suspense fallback={null}>
                    <MotorModel />
                    <Environment preset="studio" />
                  </Suspense>
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* == POPULAR PARTS SECTION - RESTORED & ANIMATED == */}
      {/* ================================================================== */}
      <AnimatedSection id="manufacture" className="py-20 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              The Most Popular
              <br />
              <span className="text-slate-500 italic">Parts</span> We Produce
            </h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[{
              title: 'Spherical Joint', specs: { Material: 'Steel, Stainless Steel', 'Load Capacity': 'Up to 10,000 N', Thread: 'M8 to M30' }
            }, {
              title: 'Protective Cap', specs: { Material: 'Steel, Rubber', 'Fit Type': 'Snap-on, Threaded', 'Impact Resistance': '10 J' }
            }].map((part, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-white rounded-2xl p-8 shadow-md border border-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{part.title}</h3><span className="text-slate-400">→</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                  {Object.entries(part.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between"><span className="font-medium text-slate-700">{key}:</span><span>{value}</span></div>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg">
              <div className="text-center h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Drag & Drop<br />Your 3D Design</h3>
                <div className="my-6">
                  <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <p className="text-indigo-100 text-sm font-mono">IGES / STL / FBX / DXF / STEP</p>
                </div>
                <button className="w-full bg-white text-indigo-600 py-3 px-6 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">Upload Design</button>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Video Section */}
      <AnimatedSection id="video" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">See Our Process in Action</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">From digital design to tangible product, witness the precision and speed of our automated manufacturing.</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <iframe src="https://www.youtube.com/embed/E1czmX6bjFA?start=10" title="Vignam Text to Simulations Demo" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* ================================================================== */}
      {/* == CNC PARTS SECTION - RESTORED & ANIMATED == */}
      {/* ================================================================== */}
      <AnimatedSection className="py-20 px-6 bg-gradient-to-br from-indigo-700 to-purple-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-8">
            Precision <span className="italic text-indigo-200">CNC</span> Parts<br />Shipped as Fast as Tomorrow
          </motion.h2>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-6 my-16">
            {["", "", "", "", ""].map((_, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-white/10 backdrop-blur rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-colors flex items-center justify-center aspect-square">
                <svg className="w-16 h-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-white text-lg leading-relaxed mb-6">Upload your CAD file, and we'll take care of machining, finishing, and shipping—accurate parts delivered fast, no stress.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-2 transition-colors">
              <span>Upload Your Design</span>
            </motion.button>
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0"><div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"><span className="text-lg font-bold">F</span></div><span className="text-xl font-semibold">Forge</span></div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Support</a>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-slate-800"><p className="text-slate-400">© 2025 Forge Manufacturing. All rights reserved.</p></div>
        </div>
      </footer>
    </div>
  );
};

export default ForgeManufacturingLanding;