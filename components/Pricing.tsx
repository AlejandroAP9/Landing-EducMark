import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { FadeIn, Button, SectionTitle } from './ui/UIComponents';
import { Plan } from '../types';

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Plan Copihue',
    icon: '🌸',
    price: '$13.900',
    imagesCount: 180,
    features: [
      { text: '20 Clases completas/mes', included: true },
      { text: '20 PPTs editables', included: true },
      { text: '20 Quiz Interactivos', included: true },
      { text: 'Soporte VIP', included: true },
    ],
    url: 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=2c93808495079466019539f36ee316bb'
  },
  {
    id: 'pro',
    name: 'Plan Araucaria',
    icon: '🌲',
    price: '$21.900',
    recommended: true,
    imagesCount: 315,
    features: [
      { text: '35 Clases completas/mes', included: true },
      { text: '35 PPTs editables', included: true },
      { text: '35 Quiz Interactivos', included: true },
      { text: 'Imágenes IA Premium', included: true },
      { text: 'Soporte Prioritario', included: true },
    ],
    url: 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=6d270cc5cf9a47c981e2cdbab6ba7b87'
  },
  {
    id: 'expert',
    name: 'Plan Cóndor',
    icon: '🦅',
    price: '$29.900',
    imagesCount: 450,
    features: [
      { text: '50 Clases completas/mes', included: true },
      { text: '50 PPTs editables', included: true },
      { text: '50 Quiz Interactivos', included: true },
      { text: 'Acceso anticipado a funciones', included: true },
    ],
    url: 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=5103f2ef25304da4a5d7ea0bb126e1c3'
  }
];

export const Pricing: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 16, hours: 1, mins: 57, secs: 13 });
  const [spotsLeft, setSpotsLeft] = useState(37);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev; 
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openPayment = (url: string) => {
    window.open(url, 'mercadopago_checkout', 'width=800,height=600,scrollbars=yes,resizable=yes,centerscreen=yes');
  };

  return (
    <>
      {/* Founders Offer */}
      <section id="founders" className="py-12 px-4">
        <FadeIn>
          <div className="container max-w-4xl mx-auto bg-gradient-to-br from-primary to-[#8a6fff] rounded-3xl p-8 md:p-12 text-center shadow-[0_10px_40px_rgba(110,86,207,0.3)] text-[#0f0f1a]">
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-white">
              🔥 OFERTA PARA FUNDADORES 🔥
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Sé uno de nuestros primeros 100 miembros y asegura este precio especial de por vida.
              Nunca te subiremos el precio.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[80px]">
                  <div className="text-2xl font-bold text-white">{(value as number) < 10 ? `0${value}` : value}</div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{unit}</div>
                </div>
              ))}
            </div>

            <div className="inline-block bg-[#2D2D44] px-6 py-2 rounded-full text-destructive font-bold shadow-lg animate-pulse">
              ¡Sólo quedan {spotsLeft} cupos a este precio!
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Pricing Cards */}
      <section id="planes" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <FadeIn>
            <SectionTitle 
              title="Planes Flexibles" 
              subtitle="La misma calidad premium en todos los niveles. Elige según cuántas clases necesitas al mes."
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            {plans.map((plan, idx) => (
              <FadeIn key={plan.id} delay={idx * 0.1}>
                <div className={`relative bg-card border ${plan.recommended ? 'border-primary shadow-[0_0_30px_rgba(164,143,255,0.15)] transform md:-translate-y-4' : 'border-border'} rounded-3xl p-8 flex flex-col h-full hover:border-primary/50 transition-all duration-300`}>
                  
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-background text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      Recomendado
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-white mb-1">{plan.price}<span className="text-sm text-muted-foreground font-normal">/mes</span></div>
                    <div className="text-xs text-muted-foreground">IVA incluido</div>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: feature.text.replace('Clases', '<strong>Clases</strong>').replace('Quiz', '<strong>Quiz</strong>') }} />
                      </li>
                    ))}
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                         <Check className="w-5 h-5 text-primary shrink-0" />
                         <span><strong>{plan.imagesCount} Imágenes</strong> IA Premium</span>
                    </li>
                  </ul>

                  <Button 
                    variant={plan.recommended ? 'primary' : 'secondary'} 
                    fullWidth 
                    onClick={() => openPayment(plan.url)}
                  >
                    {plan.recommended ? 'Empezar Ahora' : 'Elegir Plan'}
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 text-center flex justify-center items-center gap-2 text-muted-foreground text-sm">
             <ShieldCheck size={16} className="text-primary" />
             <span>Garantía de 7 días: si no te gusta, te devolvemos el dinero.</span>
          </div>
        </div>
      </section>
    </>
  );
};