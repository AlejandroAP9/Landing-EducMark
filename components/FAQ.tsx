import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FadeIn, SectionTitle } from './ui/UIComponents';
import { FaqItem } from '../types';

const faqs: FaqItem[] = [
  {
    question: "¿Realmente cumple con el currículum chileno oficial?",
    answer: "Absolutamente. Nuestro sistema se basa exclusivamente en bases curriculares MINEDUC, programas de estudio oficiales, guías docentes y textos del estudiante."
  },
  {
    question: "¿Qué pasa si no estoy satisfecho con el servicio?",
    answer: "Garantía total de devolución por 7 días. Si EducMark no cumple tus expectativas, devolvemos el 100% de tu inversión inmediatamente."
  },
  {
    question: "¿Funciona para todas las asignaturas?",
    answer: "Sí, EducMark cubre la mayoría de las asignaturas. Las asignaturas científicas son más complejas al requerir fórmulas, pero están soportadas."
  },
  {
    question: "¿Cómo garantizan la calidad del contenido?",
    answer: "Nuestro algoritmo fue entrenado específicamente con documentos oficiales MINEDUC y validado por equipos pedagógicos chilenos."
  },
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario sin penalizaciones."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background to-[#131320]">
      <div className="container mx-auto px-4 max-w-3xl">
        <FadeIn>
          <SectionTitle title="Preguntas Frecuentes" />
        </FadeIn>

        <div className="space-y-4 mt-8">
          {faqs.map((faq, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div 
                className={`bg-card border ${openIndex === idx ? 'border-primary' : 'border-border'} rounded-2xl overflow-hidden transition-all duration-300`}
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                  {openIndex === idx ? <Minus className="text-primary shrink-0" /> : <Plus className="text-primary shrink-0" />}
                </button>
                <div 
                  className={`px-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.answer}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};