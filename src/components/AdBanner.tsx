import React from 'react';

export type AdSlotPosition =
  | 'header_leaderboard'
  | 'incontent_sidebar'
  | 'post_results'
  | 'bottom_footer';

interface AdBannerProps {
  position: AdSlotPosition;
  className?: string;
  onOpenAdGuide?: () => void;
}

/**
 * CONFIGURAÇÃO DO GOOGLE ADSENSE:
 * 
 * Por padrão, enquanto você não tiver sua conta do AdSense aprovada e os códigos de bloco reais,
 * este componente retorna `null` (NÃO exibe caixas cinzas ou espaços vazios).
 * Isso segue a recomendação oficial do Google para aprovação de sites (evita recusa por 'Site em construção').
 * 
 * Quando sua conta for aprovada pelo Google:
 * 1. Mude `IS_ADSENSE_ACTIVE` para `true`.
 * 2. Preencha `CLIENT_ID` com seu 'ca-pub-XXXXXXXXXXXXXXXX'.
 * 3. Preencha os IDs numéricos dos blocos gerados no painel do AdSense.
 */
export const ADSENSE_CONFIG = {
  active: false, // Alterne para true quando tiver o AdSense aprovado
  clientId: 'ca-pub-XXXXXXXXXXXXXXXX', // Seu ID do AdSense
  slots: {
    header_leaderboard: '1234567890',
    incontent_sidebar: '2345678901',
    post_results: '3456789012',
    bottom_footer: '4567890123',
  },
};

export const AdBanner: React.FC<AdBannerProps> = ({
  position,
  className = '',
}) => {
  // Se o AdSense ainda não estiver ativo, não renderiza nada na tela (layout 100% limpo)
  if (!ADSENSE_CONFIG.active) {
    return null;
  }

  const slotId = ADSENSE_CONFIG.slots[position];

  return (
    <div
      className={`relative w-full my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-1">
        Publicidade
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

