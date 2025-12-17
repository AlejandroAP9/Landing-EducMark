import React from 'react';
import { Star } from 'lucide-react';
import { FadeIn, SectionTitle } from './ui/UIComponents';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    initials: 'MP',
    color: 'bg-blue-500',
    name: 'María Pérez',
    role: 'Prof. Básica',
    location: 'La Serena',
    text: "Pasé de pasar los domingos planificando a tener todo listo en horas. Mis estudiantes lo notaron altiro. EducMark me devolvió mi vida."
  },
  {
    initials: 'JT',
    color: 'bg-green-500',
    name: 'Juan Torres',
    role: 'Prof. Historia',
    location: 'Santiago',
    text: "La alineación con el MINEDUC es real. Me ahorra correcciones y deja todo claro desde el inicio para la UTP."
  },
  {
    initials: 'CF',
    color: 'bg-yellow-500',
    name: 'Carla F.',
    role: 'Prof. Lenguaje',
    location: 'Temuco',
    text: "Por fin actividades que calzan con mi curso y no ejemplos gringos traducidos. El cambio en participación fue brutal."
  }
];

export const SocialProof: React.FC = () => {
  return (
    <section id="testimonios" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn>
          <SectionTitle title="Lo Que Dicen Tus Colegas" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div className="bg-card border border-border p-8 rounded-2xl h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}, {t.location}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4 text-[#fbbf24]">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="italic text-muted-foreground leading-relaxed">"{t.text}"</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
                Más de <span className="text-white font-bold">1,200 profesores</span> ya confían en EducMark este mes.
            </p>
        </FadeIn>
      </div>
    </section>
  );
};