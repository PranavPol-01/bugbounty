"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-bg-dark py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 4vw, 36px)" }}>
            See <span className="gradient-text">DecentraBounty</span> in Action
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden bg-bg-section"
        >
          {!playing ? (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setPlaying(true)}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-purple/20" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-orange/90 flex items-center justify-center hover:bg-orange transition-colors shadow-glow">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="text-6xl">🛡️</div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-section text-gray-400 font-body">
              <p>Video player placeholder — Connect your video URL</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
