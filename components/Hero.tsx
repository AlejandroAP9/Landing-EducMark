import React, { useEffect, useRef } from 'react';
import { ArrowRight, Check, Share2 } from 'lucide-react';
import { Button, FadeIn } from './ui/UIComponents';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const densityDivider = window.innerWidth < 768 ? 25000 : 15000;
      const count = Math.floor((width * height) / densityDivider);

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(164, 143, 255, 0.5)';
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(164, 143, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
      
      {/* Gradient Overlay for bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 z-20 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary-100">IA Generativa v2.0 Disponible</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.1] tracking-tight mb-6">
              Planifica 10 Clases <br className="hidden md:block" />
              Perfectas en <span className="bg-gradient-primary bg-clip-text text-transparent">1 Hora</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              La IA diseñada para profesores chilenos. Genera planificaciones, PPTs y evaluaciones 
              alineadas al MINEDUC en minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={() => window.location.href='auth.html'} className="text-lg px-8 py-4">
                Probar 3 Clases Gratis
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('pasos')?.scrollIntoView({behavior: 'smooth'})} className="text-lg px-8 py-4 group">
                Ver Demo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { text: "Alineado al MINEDUC", tooltip: "Cumple 100% con las Bases Curriculares y Programas de Estudio vigentes." },
                { text: "Hecho por profes", tooltip: "Diseñado por docentes para resolver problemas reales del aula." },
                { text: "Gratis 3 clases", tooltip: "Regístrate y genera tus primeras 3 planificaciones completas sin costo." }
              ].map((item, i) => (
                <div 
                  key={i} 
                  title={item.tooltip}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-primary/50 hover:text-white cursor-help hover:shadow-[0_0_15px_rgba(164,143,255,0.3)]"
                >
                  <Check className="text-primary w-4 h-4" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-16 relative group">
            <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 pointer-events-none rounded-full"></div>
            <img 
              src="https://picsum.photos/1200/800" 
              alt="Dashboard Preview" 
              className="relative rounded-xl border border-white/10 shadow-2xl transform rotate-x-12 perspective-1000 w-full max-w-5xl"
            />
            
            {/* Botón Compartir */}
            <button 
              onClick={() => alert("¡Comparte EducMark!")}
              className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-primary/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg group-hover:scale-105"
              aria-label="Compartir"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};