import React from 'react';
import { FileText, Presentation, Gamepad2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn, SectionTitle } from './ui/UIComponents';

export const Features: React.FC = () => {
  return (
    <>
      {/* Steps Section */}
      <section id="pasos" className="py-24 bg-background relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SectionTitle 
              title="Tu Clase Lista en 3 Pasos" 
              subtitle="Sin configuraciones complejas. Entras, eliges y descargas."
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

            {[
              { num: 1, title: 'Selecciona', desc: 'Elige tu curso, asignatura y el OA oficial del MINEDUC desde nuestro menú.' },
              { num: 2, title: 'Personaliza', desc: 'Ajusta palabras clave, duración o necesidades educativas especiales (DUA).' },
              { num: 3, title: 'Descarga', desc: 'En segundos, obtén tu Planificación PDF, PPT editable y Quiz listos.' }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.2} className="relative z-10">
                <div className="bg-card backdrop-blur-md border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors group text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(164,143,255,0.3)]">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-24 bg-[#131320]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex justify-center mb-6">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
                ★ Lo que recibes en cada descarga
              </span>
            </div>
            <SectionTitle 
              title="No es sólo texto. Es tu Kit Completo." 
              subtitle="Olvídate de copiar y pegar desde ChatGPT. EducMark te entrega archivos profesionales listos para proyectar e imprimir."
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 max-w-6xl mx-auto">
            {/* Planning Card */}
            <FadeIn className="md:col-span-6 bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#a48fff]"></div>
              <div className="absolute top-6 right-6 bg-[#a48fff]/20 text-[#a48fff] text-xs font-bold px-3 py-1 rounded-full uppercase">Formato PDF</div>
              
              <div>
                <div className="w-14 h-14 bg-[#a48fff]/10 rounded-2xl flex items-center justify-center mb-6 text-[#a48fff]">
                  <FileText size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Planificación Docente</h3>
                <p className="text-muted-foreground mb-6">Cumple con UTP sin estrés. Documento completo con:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  {['Objetivos (OA) y Habilidades', 'Indicadores de Logro', 'Estrategias DUA y NEE', 'Rúbrica de evaluación'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a48fff]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* PPT Card */}
            <FadeIn delay={0.2} className="md:col-span-6 bg-card border border-border rounded-3xl p-8 hover:border-[#fbbf24]/50 transition-all flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#fbbf24]"></div>
              <div className="absolute top-6 right-6 bg-[#fbbf24]/20 text-[#fbbf24] text-xs font-bold px-3 py-1 rounded-full uppercase">Google Slides</div>
              
              <div>
                <div className="w-14 h-14 bg-[#fbbf24]/10 rounded-2xl flex items-center justify-center mb-6 text-[#fbbf24]">
                  <Presentation size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Clase Visual Lista</h3>
                <p className="text-muted-foreground mb-4">Nada de diapositivas en blanco. Secuencia didáctica con Inicio, Desarrollo y Cierre.</p>
                <div className="p-3 bg-[#fbbf24]/10 rounded-lg text-[#fbbf24] text-sm">
                  ★ Incluye imágenes generadas por IA y contexto chileno.
                </div>
              </div>
            </FadeIn>

            {/* Quiz Card */}
            <FadeIn delay={0.4} className="md:col-span-6 bg-card border border-border rounded-3xl p-8 hover:border-[#10b981]/50 transition-all flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#10b981]"></div>
              <div className="absolute top-6 right-6 bg-[#10b981]/20 text-[#10b981] text-xs font-bold px-3 py-1 rounded-full uppercase">App Interactiva</div>
              
              <div>
                <div className="w-14 h-14 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mb-6 text-[#10b981]">
                  <Gamepad2 size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Gamificado</h3>
                <p className="text-muted-foreground mb-4">Evaluación formativa que funciona en cualquier navegador.</p>
                <div className="text-sm text-[#10b981] italic opacity-80">
                  "Feedback inmediato: Si el alumno se equivoca, la IA le explica por qué."
                </div>
              </div>
            </FadeIn>

            {/* Speed Card */}
            <FadeIn delay={0.6} className="md:col-span-6 bg-primary/10 border border-primary/50 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/5 blur-3xl"></div>
               <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg relative z-10">
                 <Zap size={32} fill="currentColor" />
               </div>
               <h3 className="text-2xl font-bold mb-2 relative z-10">Todo esto en ± 6 minutos</h3>
               <p className="text-foreground/80 mb-6 relative z-10">
                 Generar estos 3 recursos manualmente te tomaría <strong>3 horas</strong>. Con EducMark, te tomas un café y está listo.
               </p>
               <button onClick={() => window.location.href='auth.html'} className="relative z-10 bg-primary text-background px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all shadow-lg">
                 Crear mi primera clase
               </button>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};