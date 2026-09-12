export type Faq = { q: string; a: string }

export const HOME_FAQ: { en: Faq[]; fr: Faq[] } = {
  en: [
    {
      q: 'What is NaanoX?',
      a: 'NaanoX is a B2B LinkedIn creator marketplace: companies discover and book vetted creators for sponsored LinkedIn campaigns, each at a fixed price per post set by the creator. The marketplace spans creators from niche voices with around 1,000 followers to established B2B creators with audiences of several hundred thousand.',
    },
    {
      q: 'How does NaanoX find the right creators?',
      a: 'Our matching engine scores every creator on audience fit, category relevance and engagement quality across LinkedIn, X and YouTube, so you rank creators by who actually reaches your buyers, not by follower count.',
    },
    {
      q: 'Which networks do you support?',
      a: 'LinkedIn, X and YouTube today, with more on the way. You can compare creators and track performance across every network in one place.',
    },
    {
      q: 'How does per-post pricing work?',
      a: 'Campaigns start from €20 per published post, you only pay for posts that go live, with no retainer. Prefer a hands-off setup? Done for you adds our team executing everything end to end.',
    },
    {
      q: 'How does attribution work?',
      a: 'NaanoX places a tracking pixel at every stage of the funnel, so each click, lead, pipeline and revenue is tied back to the exact creator and post that drove it.',
    },
    {
      q: 'Do you handle creator payouts?',
      a: 'Yes. Approve content and pay every creator in one click, securely via Stripe Connect, invoices and approvals are handled for you.',
    },
    {
      q: "What's the difference between Free and Done for you?",
      a: 'Free gives your team the platform to source creators and run simple campaigns yourselves. Done for you adds hands-on execution by the NaanoX team, sourcing, briefs, reporting and optimisation.',
    },
    {
      q: 'Can I upgrade or cancel anytime?',
      a: 'Absolutely. Plans are month-to-month, you can upgrade, downgrade or cancel whenever you like.',
    },
  ],
  fr: [
    {
      q: "Qu'est-ce que NaanoX ?",
      a: "NaanoX est une marketplace de créateurs LinkedIn B2B : les entreprises y trouvent et réservent des créateurs vérifiés pour des campagnes LinkedIn sponsorisées, chacune à prix fixe par post défini par le créateur. La marketplace couvre des créateurs de niche d'environ 1 000 abonnés jusqu'à des voix B2B établies à plusieurs centaines de milliers d'abonnés.",
    },
    {
      q: 'Comment NaanoX trouve-t-il les bons créateurs ?',
      a: "Notre moteur de matching score chaque créateur sur l'adéquation d'audience, la pertinence de catégorie et la qualité d'engagement sur LinkedIn, X et YouTube — pour classer les créateurs selon ceux qui touchent vraiment vos acheteurs, pas selon le nombre d'abonnés.",
    },
    {
      q: 'Quels réseaux sont supportés ?',
      a: "LinkedIn, X et YouTube aujourd'hui, d'autres arrivent. Vous comparez les créateurs et suivez la performance sur tous les réseaux au même endroit.",
    },
    {
      q: 'Comment fonctionne le prix par post ?',
      a: "Les campagnes commencent à 20 € par post publié. Vous ne payez que les posts réellement mis en ligne, sans abonnement. Vous préférez déléguer ? Avec Done for you, notre équipe s'occupe de tout de A à Z.",
    },
    {
      q: "Comment fonctionne l'attribution ?",
      a: "NaanoX place un pixel de suivi à chaque étape du funnel : chaque clic, lead, opportunité dans le pipeline et revenu est attribué au créateur et au post qui l'a généré.",
    },
    {
      q: 'Gérez-vous les paiements créateurs ?',
      a: 'Oui. Approuvez le contenu et payez chaque créateur en un clic, via Stripe Connect — factures et validations sont gérées pour vous.',
    },
    {
      q: 'Quelle est la différence entre Free et Done for you ?',
      a: "Free donne à votre équipe la plateforme pour sourcer des créateurs et gérer elle-même des campagnes simples. Done for you ajoute l'exécution par l'équipe NaanoX : sourcing, briefs, reporting et optimisation.",
    },
    {
      q: 'Puis-je upgrader ou annuler à tout moment ?',
      a: 'Absolument. Les plans sont mensuels : upgrade, downgrade ou annulation quand vous voulez.',
    },
  ],
}

export const CREATORS_FAQ: { en: Faq[]; fr: Faq[] } = {
  en: [
    {
      q: 'What is NaanoX?',
      a: 'NaanoX is the B2B LinkedIn creator marketplace: B2B brands book creators for sponsored LinkedIn posts at a fixed price per post that you set. Creators from about 1,000 to 500,000 followers use NaanoX to monetize their LinkedIn audience with deals from B2B brands they already know.',
    },
    { q: 'Is NaanoX free for creators?', a: 'Yes, always. Joining and using NaanoX is completely free, and you keep 100% of what you earn on every deal.' },
    {
      q: 'How much can I earn?',
      a: 'Creators earn on average €500 per deal, with top deals reaching €1,500. You choose which deals to take, so your earnings scale with how much you post.',
    },
    {
      q: 'How and when do I get paid?',
      a: 'You get paid within 24h of your post going live, securely via Stripe or bank transfer. No invoicing, no chasing, it happens automatically.',
    },
    {
      q: 'Do I have to sign an exclusivity contract?',
      a: 'No. There is no exclusivity, no minimum and no lock-in. You pick the deals you want and quit anytime while keeping everything you have earned.',
    },
    {
      q: 'What kind of brands are on NaanoX?',
      a: 'B2B brands you already know: SaaS, sales, marketing and prospecting tools like Lemlist, Folk, Ringover and Gojiberry, plus 20+ more, with new deals every week.',
    },
    {
      q: 'Do I keep control of my content?',
      a: 'Completely. You post in your own voice. Each brief gives you an angle, a hook and a CTA plus full product access, but the words are always yours.',
    },
    { q: 'How do I join?', a: 'Apply in about 2 minutes, no commitment. Once approved you can browse open deals and start earning right away.' },
  ],
  fr: [
    {
      q: "Qu'est-ce que NaanoX ?",
      a: "NaanoX est la marketplace de créateurs LinkedIn B2B : les marques B2B y réservent des créateurs pour des posts LinkedIn sponsorisés, à un prix fixe par post que vous définissez. Des créateurs d'environ 1 000 à 500 000 abonnés utilisent NaanoX pour monétiser leur audience LinkedIn avec des deals de marques B2B qu'ils connaissent déjà.",
    },
    { q: 'NaanoX est-il gratuit pour les créateurs ?', a: 'Oui, toujours. Rejoindre et utiliser NaanoX est entièrement gratuit, et vous gardez 100 % de ce que vous gagnez sur chaque deal.' },
    {
      q: 'Combien puis-je gagner ?',
      a: 'Les créateurs gagnent en moyenne 500 € par collaboration, et les mieux rémunérées atteignent 1 500 €. Vous choisissez les collaborations qui vous intéressent : vos gains dépendent donc du nombre de posts que vous publiez.',
    },
    {
      q: 'Comment et quand suis-je payé ?',
      a: 'Vous êtes payé dans les 24 h suivant la publication de votre post, en toute sécurité via Stripe ou par virement bancaire. Aucune facture à créer, aucune relance : tout est automatique.',
    },
    {
      q: "Dois-je signer un contrat d'exclusivité ?",
      a: "Non. Aucune exclusivité, aucun minimum et aucun engagement. Vous choisissez les collaborations qui vous intéressent et pouvez arrêter à tout moment, tout en conservant l'intégralité de vos gains.",
    },
    {
      q: 'Quelles marques sont sur NaanoX ?',
      a: 'Des marques B2B que vous connaissez déjà : SaaS, sales, marketing et prospection comme Lemlist, Folk, Ringover et Gojiberry, plus 20 autres, avec de nouveaux deals chaque semaine.',
    },
    {
      q: 'Est-ce que je garde le contrôle de mon contenu ?',
      a: 'Oui, totalement. Vous publiez avec votre propre ton. Chaque brief vous donne un angle, une accroche, un CTA et un accès complet au produit, mais les mots restent les vôtres.',
    },
    { q: 'Comment rejoindre ?', a: 'Candidature en environ 2 minutes, sans engagement. Une fois approuvé, vous parcourez les deals ouverts et commencez à gagner tout de suite.' },
  ],
}
