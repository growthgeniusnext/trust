/* =========================================================================
   CHAT ASSISTANT — Abdoulaye Ouattara
   -------------------------------------------------------------------------
   Ce widget fonctionne tout seul, sans backend : il répond à partir d'une
   base de connaissances locale (mots-clés) sur les services, les marques
   et le contact d'Abdoulaye. Chaque question envoyée obtient TOUJOURS une
   réponse (jamais de silence), et la conversation n'a aucune limite de
   temps : elle peut durer 5 minutes, 30 minutes, peu importe.

   BRANCHER UNE VRAIE IA (ex. l'API Claude d'Anthropic) :
   -------------------------------------------------------------------------
   Le JS d'une page statique ne doit jamais contenir une clé API en clair
   (elle serait visible par n'importe qui via "Voir le code source").
   Pour utiliser une vraie IA, il faut un petit serveur relais (backend)
   qui garde la clé secrète, et que ce script appelle à la place de
   getLocalAnswer(). Exemple minimal (Node/Express) :

     app.post('/api/chat', async (req, res) => {
       const r = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'x-api-key': process.env.ANTHROPIC_API_KEY,
           'anthropic-version': '2023-06-01',
           'content-type': 'application/json'
         },
         body: JSON.stringify({
           model: 'claude-sonnet-4-6',
           max_tokens: 500,
           messages: [{ role: 'user', content: req.body.message }]
         })
       });
       const data = await r.json();
       res.json({ reply: data.content[0].text });
     });

   Puis dans ce fichier, remplace l'appel à getLocalAnswer(text) par un
   fetch('/api/chat', { method:'POST', body: JSON.stringify({message:text}) })
   et utilise la réponse reçue. Le flag USE_BACKEND ci-dessous permet de
   basculer facilement une fois ton serveur relais en place.
   ========================================================================= */

const USE_BACKEND = false;              // passe à true une fois ton relais prêt
const BACKEND_URL = '/api/chat';        // adapte à l'URL de ton relais

const toggleBtn   = document.getElementById('chat-toggle');
const closeBtn    = document.getElementById('chat-close');
const panel       = document.getElementById('chat-panel');
const messagesEl  = document.getElementById('chat-messages');
const form        = document.getElementById('chat-form');
const input       = document.getElementById('chat-input');

let started = false;

toggleBtn.addEventListener('click', () => {
  panel.classList.add('open');
  toggleBtn.style.display = 'none';
  if (!started){ started = true; addBotMessage(getGreeting()); }
  input.focus();
});

closeBtn.addEventListener('click', () => {
  panel.classList.remove('open');
  toggleBtn.style.display = 'flex';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addUserMessage(text);
  input.value = '';
  respond(text);
});

function addUserMessage(text){
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function addBotMessage(text){
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.textContent = text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function showTyping(){
  const div = document.createElement('div');
  div.className = 'msg typing';
  div.id = 'typing-indicator';
  div.textContent = 'L\u2019assistant écrit…';
  messagesEl.appendChild(div);
  scrollToBottom();
}

function hideTyping(){
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function scrollToBottom(){
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Garantit une réponse à CHAQUE question, avec un léger délai naturel.
async function respond(text){
  showTyping();
  const delay = 550 + Math.random() * 500;

  let reply;
  if (USE_BACKEND){
    try {
      const r = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await r.json();
      reply = data.reply || getLocalAnswer(text);
    } catch (err){
      // Le backend est indisponible : on retombe sur la base locale
      // pour ne JAMAIS laisser une question sans réponse.
      reply = getLocalAnswer(text);
    }
  } else {
    reply = getLocalAnswer(text);
  }

  setTimeout(() => {
    hideTyping();
    addBotMessage(reply);
  }, delay);
}

function getGreeting(){
  return "Salut 👋 Je suis l'assistant d'Abdoulaye Ouattara. Pose-moi tes questions sur ses services (stratégie digitale, community building, marketing digital, montage vidéo, développement web & mobile), ses marques accompagnées, ou comment le contacter.";
}
 <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9192280002676126"
     crossorigin="anonymous"></script>

/* ---------------------------------------------------------------------
   Base de connaissances locale : mots-clés -> réponse.
   Ajoute autant d'entrées que tu veux pour couvrir plus de questions.
   --------------------------------------------------------------------- */
const KB = [
  {
    keys: ['bonjour','salut','hello','coucou','bonsoir'],
    answer: "Bonjour ! Ravi de discuter avec toi. Que veux-tu savoir sur le travail d'Abdoulaye ?"
  },
  {
    keys: ['stratégie', 'strategie', 'roadmap', 'positionnement'],
    answer: "En stratégie digitale, Abdoulaye construit des feuilles de route claires : positionnement de marque, calendrier éditorial, choix des canaux et KPI qui comptent vraiment — pas juste des vues, des résultats mesurables."
  },
  {
    keys: ['community', 'communauté', 'communaute', 'animation', 'modération', 'moderation'],
    answer: "Pour le community building, il fait grandir des communautés vivantes : animation quotidienne, modération, storytelling — l'objectif est de créer un vrai attachement entre la marque et son audience, pas juste d'accumuler des chiffres."
  },
  {
    keys: ['marketing', 'publicité', 'publicite', 'ads', 'seo', 'growth', 'campagne'],
    answer: "Côté marketing digital, il gère des campagnes social ads, du SEO et du growth marketing pour connecter la marque à l'audience qui compte, avec un budget maîtrisé."
  },
  {
    keys: ['vidéo', 'video', 'montage', 'motion', 'reel', 'reels'],
    answer: "En montage vidéo, il prend en charge tout le processus : du brief au rendu final, montage rythmé, motion design, formats verticaux et horizontaux prêts à diffuser."
  },
  {
    keys: ['site', 'application', 'app', 'développement', 'developpement', 'mobile', 'web'],
    answer: "Il conçoit aussi des sites web et applications mobiles : vitrines de marque, plateformes communautaires, outils internes — pensés pour être rapides et faciles à faire évoluer."
  },
  {
    keys: ['marque', 'marques', 'client', 'clients', 'partenaire', 'partenaires', 'rti', 'xiaomi', 'samsung', 'tecno', 'byd', 'nasco', 'cfao', 'agl', 'auto.ci', 'ministère', 'ministere'],
    answer: "Abdoulaye a accompagné des marques et institutions comme RTI, Xiaomi, Samsung, Tecno, AGL, Auto.CI, Nasco, BYD, CFAO Technologies, ainsi que des institutions publiques ivoiriennes. Tu peux voir leurs logos défiler juste au-dessus de la section services."
  },
  {
    keys: ['contact', 'joindre', 'email', 'mail', 'téléphone', 'telephone', 'whatsapp', 'rendez-vous', 'rdv'],
    answer: "Tu peux le contacter directement via les liens de la section Contact en bas de page (email, WhatsApp, LinkedIn, Instagram). N'hésite pas à lui écrire pour discuter de ton projet."
  },
  {
    keys: ['prix', 'tarif', 'tarifs', 'coût', 'cout', 'budget', 'devis'],
    answer: "Les tarifs dépendent de la taille et des objectifs de ton projet. Le mieux est de contacter Abdoulaye directement via la section Contact pour obtenir un devis adapté."
  },
  {
    keys: ['disponible', 'disponibilité', 'disponibilite', 'délai', 'delai'],
    answer: "Le badge « Disponible » en haut de la page indique qu'il est actuellement ouvert à de nouvelles missions. Contacte-le pour discuter des délais selon ton projet."
  },
  {
    keys: ['qui es-tu', 'qui es tu', 'tu es qui', 'c\'est qui', 'qui est abdoulaye'],
    answer: "Abdoulaye Ouattara est un stratège digital basé à Abidjan, Côte d'Ivoire. Il travaille sur la stratégie digitale, le community building, le marketing digital, le montage vidéo et le développement web & mobile."
  },
  {
    keys: ['merci'],
    answer: "Avec plaisir ! N'hésite pas si tu as d'autres questions — je suis là aussi longtemps que tu veux discuter."
  }
];

const FALLBACKS = [
  "Bonne question — je n'ai pas d'info précise là-dessus dans ma base, mais Abdoulaye pourra te répondre directement via la section Contact.",
  "Je ne suis pas certain de bien cerner ta question. Tu peux la reformuler, ou me demander : ses services, ses marques, ou comment le contacter.",
  "Je n'ai pas cette information exacte, mais je peux te parler de ses services (stratégie, communauté, marketing, vidéo, dev web/mobile) ou de ses marques accompagnées."
];

function getLocalAnswer(text){
  const t = text.toLowerCase();
  for (const entry of KB){
    if (entry.keys.some(k => t.includes(k))){
      return entry.answer;
    }
  }
  // Garantit toujours une réponse, même hors sujet.
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}
