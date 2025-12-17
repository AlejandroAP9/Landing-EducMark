import React, { useState, useEffect, useRef } from 'react';
import { XCircle, CheckCircle, Clock, Smile, Frown, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { FadeIn, SectionTitle } from './ui/UIComponents';

export const Comparison: React.FC = () => {
  // Counter animation logic
  const [timeSaved, setTimeSaved] = useState(0);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (!isStatsInView) return;

    const interval = setInterval(() => {
      setTimeSaved(prev => prev < 36 ? prev + 1 : 36);
    }, 40);
    return () => clearInterval(interval);
  }, [isStatsInView]);

  const statItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section id="comparativa" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-destructive/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <SectionTitle 
            title="El Costo de Seguir Igual" 
            subtitle="Tu tiempo vale más que estar planificando un domingo por la noche."
          />
        </FadeIn>

        {/* Reality Check Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          <FadeIn delay={0.2}>
            <div className="bg-card border border-destructive/50 rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(255,84,120,0.1)] transition-all">
              <div className="flex items-center justify-center gap-3 mb-8 text-destructive">
                <Frown size={40} />
                <h3 className="text-2xl font-bold">SIN EDUCMARK</h3>
              </div>
              <ul className="space-y-4">
                {[
                  '+3 horas preparando una sola clase',
                  'Domingos sacrificados trabajando',
                  'Material genérico de internet',
                  'Estrés constante y agobio',
                  'Vida personal descuidada'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-destructive/10 rounded-xl text-destructive-foreground/90">
                    <XCircle className="shrink-0 w-5 h-5 text-destructive" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-card border border-primary rounded-3xl p-8 shadow-[0_0_30px_rgba(164,143,255,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              <div className="flex items-center justify-center gap-3 mb-8 text-primary">
                <Smile size={40} className="text-[#fbbf24]" />
                <h3 className="text-2xl font-bold">CON EDUCMARK</h3>
              </div>
              <ul className="space-y-4">
                {[
                  '± 10 clases listas en 1 hora',
                  'Fines de semana libres',
                  'Material contextualizado a Chile',
                  'Tranquilidad total',
                  'Balance vida-trabajo perfecto'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl text-foreground">
                    <CheckCircle className="shrink-0 w-5 h-5 text-[#10b981]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Competitor Comparison & Stats */}
        <FadeIn>
          <div className="bg-[#1a1a2e] rounded-3xl p-8 md:p-12 border border-border">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Cómo Ahorras ± 36 Horas al Mes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* VS Table */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <div>Otros Chatbots (GPT)</div>
                  <div className="text-primary text-right">EducMark</div>
                </div>
                {[
                  { label: 'Formato', bad: 'Texto plano', good: 'PDF + PPT + Quiz' },
                  { label: 'Contexto', bad: 'Alucina currículum', good: '100% MINEDUC' },
                  { label: 'Esfuerzo', bad: 'Muchos prompts', good: '3 Clics' },
                  { label: 'Resultado', bad: 'Trabajo extra', good: 'Clase lista' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 text-sm md:text-base">
                     <div className="flex items-center gap-2 text-destructive/80">
                       <XCircle size={16} /> {row.bad}
                     </div>
                     <div className="flex items-center justify-end gap-2 text-primary font-medium">
                       {row.good} <CheckCircle size={16} />
                     </div>
                  </div>
                ))}
              </div>

              {/* Stats Dashboard */}
              <div 
                ref={statsRef}
                className="bg-[#2D2D44] rounded-2xl p-8 shadow-2xl flex flex-col justify-center"
              >
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                    <motion.div 
                      custom={0}
                      initial="hidden"
                      animate={isStatsInView ? "visible" : "hidden"}
                      variants={statItemVariants}
                      className="pt-4 sm:pt-0"
                    >
                      <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                        <Clock className="w-6 h-6" /> 6m
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Tiempo por clase</p>
                    </motion.div>
                    
                    <motion.div 
                      custom={1}
                      initial="hidden"
                      animate={isStatsInView ? "visible" : "hidden"}
                      variants={statItemVariants}
                      className="pt-4 sm:pt-0 sm:pl-4"
                    >
                       <div className="text-3xl font-bold text-primary">{timeSaved}h</div>
                       <p className="text-xs text-muted-foreground mt-2">Ahorro mensual</p>
                    </motion.div>
                    
                    <motion.div 
                      custom={2}
                      initial="hidden"
                      animate={isStatsInView ? "visible" : "hidden"}
                      variants={statItemVariants}
                      className="pt-4 sm:pt-0 sm:pl-4"
                    >
                       <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                         <TrendingUp className="w-6 h-6" /> 100%
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">Alineación Curricular</p>
                    </motion.div>
                 </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};