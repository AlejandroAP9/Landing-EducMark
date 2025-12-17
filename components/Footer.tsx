import React, { useState } from 'react';
import { Lock, Handshake, Award } from 'lucide-react';
import { Modal } from './ui/UIComponents';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="py-12 border-t border-border bg-[#0f0f1a] text-center">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground mb-4">
          &copy; 2025 EducMark Chile. Todos los derechos reservados.
        </p>
        
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <button onClick={() => setActiveModal('privacy')} className="text-muted-foreground hover:text-white transition-colors">
            Política de Privacidad
          </button>
          <button onClick={() => setActiveModal('terms')} className="text-muted-foreground hover:text-white transition-colors">
            Términos y Condiciones
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
            <Lock size={16} className="text-[#10b981]" /> 
            <span>Conexión Segura SSL</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
            <Handshake size={18} className="text-[#009EE3]" /> 
            <span>Mercado Pago</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
            <Award size={18} className="text-[#fbbf24]" /> 
            <span>Garantía 7 días</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/56995155799?text=Hola,%20tengo%20dudas%20sobre%20EducMark" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-40"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Modals */}
      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Términos y Condiciones">
         <div className="space-y-4 text-muted-foreground">
             <p><strong>1. Aceptación:</strong> Al usar EducMark aceptas estos términos.</p>
             <p><strong>2. Propiedad:</strong> El material generado es tuyo. El software es nuestro.</p>
             <p><strong>3. Pagos:</strong> Procesados por Mercado Pago de forma segura.</p>
             <p><strong>4. Garantía:</strong> 7 días de satisfacción total o devolución.</p>
         </div>
      </Modal>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Política de Privacidad">
         <div className="space-y-4 text-muted-foreground">
             <p><strong>1. Responsable:</strong> EducMark SpA.</p>
             <p><strong>2. Datos:</strong> Solo recopilamos lo necesario (email, nombre) para el servicio.</p>
             <p><strong>3. Seguridad:</strong> Usamos encriptación SSL. No vendemos tus datos.</p>
         </div>
      </Modal>
    </footer>
  );
};