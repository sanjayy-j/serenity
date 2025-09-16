(function() {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const i18n = {
    en: {
      nav_features: 'Features',
      nav_resources: 'Resources',
      nav_peer: 'Peer Support',
      nav_analytics: 'Analytics',
      cta_book: 'Book Session',
      cta_chat: 'Open AI Support',
      hero_title: 'Smart mental wellness for every student',
      hero_sub: 'AI-guided support, confidential booking, culturally inclusive resources, and peer communities—together in one platform.',
      hero_badge1: 'Anonymous & secure',
      hero_badge2: 'Culturally relevant',
      hero_badge3: 'Campus-ready',
      tile_1_t: 'AI First-Aid',
      tile_1_d: 'Chatbot offers coping tips, crisis steps, and referrals.',
      tile_2_t: 'Confidential Booking',
      tile_2_d: 'Schedule with campus counsellors in minutes.',
      tile_3_t: 'Resource Hub',
      tile_3_d: 'Videos & audio in regional languages.',
      tile_4_t: 'Peer Support',
      tile_4_d: 'Safe, moderated discussion spaces.',
      features_title: 'Everything students need for mental wellness',
      features_sub: 'Early detection, personalized help, and community care—accessible and stigma-free.',
      feature_ai_t: 'AI-Guided First-Aid',
      feature_ai_d: 'Interactive bot with CBT-inspired prompts, grounding, and referrals.',
      feature_book_t: 'Confidential Booking',
      feature_book_d: 'Book campus counsellors or helplines with privacy-first workflows.',
      feature_peer_t: 'Peer Support',
      feature_peer_d: 'Moderated forums to share experiences and uplift each other safely.',
      resources_title: 'Psychoeducational resources',
      resources_sub: 'Short videos, audio guides, and reading materials in multiple languages.',
      resources_browse: 'Browse all',
      res_1_t: '4-7-8 Breathing',
      res_1_d: 'Audio guide to calm anxiety in 2 minutes.',
      res_2_t: 'Beat Study Burnout',
      res_2_d: 'Video tips for balance and focus.',
      res_3_t: 'Sleep Hygiene',
      res_3_d: 'Checklist for restorative sleep.',
      peer_title: 'Peer support, safely moderated',
      peer_sub: 'Join topic-based spaces to connect with others who understand.',
      analytics_title: 'Anonymous trends for admins',
      analytics_sub: 'Track campus-wide wellness trends to plan interventions.',
      analytics_cta: 'View dashboard',
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      footer_contact: 'Contact',
      booking_title: 'Book a confidential session',
      booking_name: 'Full name',
      booking_email: 'Email',
      booking_sid: 'Student ID',
      booking_concern: 'Primary concern',
      booking_mode: 'Mode',
      booking_date: 'Preferred date',
      booking_time: 'Preferred time',
      booking_submit: 'Submit',
      chat_title: 'AI First-Aid Support',
      chat_send: 'Send'
    },
    hi: {
      nav_features: 'विशेषताएँ',
      nav_resources: 'संसाधन',
      nav_peer: 'सहपाठी सहायता',
      nav_analytics: 'विश्लेषिकी',
      cta_book: 'सेशन बुक करें',
      cta_chat: 'एआई सहायता खोलें',
      hero_title: 'हर छात्र के लिए स्मार्ट मानसिक स्वास्थ्य',
      hero_sub: 'एआई सहायता, गोपनीय बुकिंग, सांस्कृतिक रूप से प्रासंगिक संसाधन और समुदाय—सब एक मंच पर।',
      hero_badge1: 'अनाम और सुरक्षित',
      hero_badge2: 'सांस्कृतिक रूप से प्रासंगिक',
      hero_badge3: 'कैंपस के लिए तैयार',
      tile_1_t: 'एआई फर्स्ट-एड',
      tile_1_d: 'चैटबॉट से निपटने के सुझाव और रेफ़रल।',
      tile_2_t: 'गोपनीय बुकिंग',
      tile_2_d: 'काउंसलर से मिनटों में समय लें।',
      tile_3_t: 'रिसोर्स हब',
      tile_3_d: 'क्षेत्रीय भाषाओं में वीडियो और ऑडियो।',
      tile_4_t: 'सहपाठी सहायता',
      tile_4_d: 'सुरक्षित, मॉडरेटेड चर्चा स्थान।',
      features_title: 'मानसिक स्वास्थ्य के लिए छात्रों को सब कुछ',
      features_sub: 'जल्दी पहचान, व्यक्तिगत मदद और समुदाय—सुलभ और बिना कलंक।',
      feature_ai_t: 'एआई-निर्देशित फर्स्ट-एड',
      feature_ai_d: 'सीबीटी-प्रेरित प्रॉम्प्ट, ग्राउंडिंग और रेफ़रल।',
      feature_book_t: 'गोपनीय बुकिंग',
      feature_book_d: 'गोपनीयता-प्रथम वर्कफ़्लो के साथ बुक करें।',
      feature_peer_t: 'सहपाठी सहायता',
      feature_peer_d: 'अनुभव साझा करने के लिए मॉडरेटेड फ़ोरम।',
      resources_title: 'मनो-शैक्षिक संसाधन',
      resources_sub: 'छोटे वीडियो, ऑडियो गाइड और पठन सामग्री।',
      resources_browse: 'सभी देखें',
      res_1_t: '4-7-8 श्वसन',
      res_1_d: '2 मिनट में चिंता शांत करें।',
      res_2_t: 'स्टडी बर्नआउट',
      res_2_d: 'संतुलन और फोकस के लिए टिप्स।',
      res_3_t: 'नींद स्वच्छता',
      res_3_d: 'बेहतर नींद के लिए चेकलिस्ट।',
      peer_title: 'सुरक्षित मॉडरेशन के साथ सहपाठी सहायता',
      peer_sub: 'समझने वाले लोगों से जुड़ें।',
      analytics_title: 'प्रशासकों के लिए गुमनाम रुझान',
      analytics_sub: 'हस्तक्षेप की योजना के लिए कैंपस रुझानों को ट्रैक करें।',
      analytics_cta: 'डैशबोर्ड देखें',
      footer_privacy: 'गोपनीयता',
      footer_terms: 'नियम',
      footer_contact: 'संपर्क',
      booking_title: 'गोपनीय सत्र बुक करें',
      booking_name: 'पूरा नाम',
      booking_email: 'ईमेल',
      booking_sid: 'स्टूडेंट आईडी',
      booking_concern: 'मुख्य चिंता',
      booking_mode: 'मोड',
      booking_date: 'पसंदीदा तिथि',
      booking_time: 'पसंदीदा समय',
      booking_submit: 'जमा करें',
      chat_title: 'एआई फर्स्ट-एड सहायता',
      chat_send: 'भेजें'
    }
  };

  function applyI18n(lang) {
    $$('#year').forEach(() => {}); // no-op to keep API similar if extended
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = i18n[lang][key];
      if (typeof text === 'string') el.textContent = text;
    });
  }

  function initLanguage() {
    const select = $('#languageSelect');
    const saved = localStorage.getItem('serenity_lang') || 'en';
    select.value = saved;
    applyI18n(saved);
    select.addEventListener('change', () => {
      const lang = select.value;
      localStorage.setItem('serenity_lang', lang);
      applyI18n(lang);
    });
  }

  function modal(open) {
    const modalEl = $('#bookingModal');
    if (open) {
      modalEl.classList.remove('hidden');
      modalEl.classList.add('flex');
      setTimeout(() => $('#fullName')?.focus(), 0);
    } else {
      modalEl.classList.add('hidden');
      modalEl.classList.remove('flex');
    }
  }

  function initBooking() {
    $('#openBooking')?.addEventListener('click', () => modal(true));
    $('#openBooking2')?.addEventListener('click', () => modal(true));
    $$('[data-modal-close]').forEach((el) => el.addEventListener('click', () => modal(false)));
    $('#bookingForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $('#bookingStatus');
      status.textContent = 'Submitting...';
      const form = e.currentTarget;
      const data = Object.fromEntries(new FormData(form));
      try {
        // Placeholder submission; integrate with backend API later
        await new Promise((res) => setTimeout(res, 800));
        console.log('Booking payload', data);
        status.textContent = 'Request received. We will email confirmation.';
        form.reset();
        setTimeout(() => modal(false), 1000);
      } catch (err) {
        status.textContent = 'Something went wrong. Try again.';
      }
    });
  }

  function pushMessage(side, text) {
    const wrap = document.createElement('div');
    wrap.className = side === 'bot' ? 'flex items-start gap-2' : 'flex items-start gap-2 justify-end';
    const bubble = document.createElement('div');
    bubble.className = side === 'bot' ? 'max-w-[80%] rounded-2xl bg-white/90 text-gray-900 px-3 py-2' : 'max-w-[80%] rounded-2xl bg-emerald-500 text-white px-3 py-2';
    bubble.textContent = text;
    if (side === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold';
      avatar.textContent = 'AI';
      wrap.appendChild(avatar);
      wrap.appendChild(bubble);
    } else {
      wrap.appendChild(bubble);
      const avatar = document.createElement('div');
      avatar.className = 'h-7 w-7 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold';
      avatar.textContent = 'You';
      wrap.appendChild(avatar);
    }
    const list = $('#chatMessages');
    list.appendChild(wrap);
    list.scrollTop = list.scrollHeight;
  }

  function botReply(userText) {
    // Very simple rules; replace with API call later
    const lower = userText.toLowerCase();
    if (lower.includes('anxiety') || lower.includes('nervous')) {
      return 'Try the 4-7-8 breathing: inhale 4, hold 7, exhale 8. Want a 2-min audio?';
    }
    if (lower.includes('sleep')) {
      return 'Keep a consistent bedtime and reduce screens 1 hour before sleep. Need a checklist?';
    }
    if (lower.includes('panic')) {
      return 'Let’s ground together: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.';
    }
    if (lower.includes('book') || lower.includes('counsel')) {
      return 'I can help you book a session. Tap "Book Session" to proceed.';
    }
    return 'I am here with you. Share what’s on your mind, or ask for grounding, sleep tips, or booking help.';
  }

  function initChatbot() {
    const fab = $('#chatbotFab');
    const panel = $('#chatbotPanel');
    const close = $('#closeChat');
    const form = $('#chatForm');
    const input = $('#chatInput');

    function openChat() {
      panel.classList.remove('hidden');
      fab.setAttribute('aria-expanded', 'true');
      if (!$('#chatMessages').hasChildNodes()) {
        pushMessage('bot', 'Hi! I can offer quick coping strategies and connect you to help.');
      }
      input.focus();
    }
    function closeChat() {
      panel.classList.add('hidden');
      fab.setAttribute('aria-expanded', 'false');
    }

    fab?.addEventListener('click', openChat);
    $('#openChat')?.addEventListener('click', openChat);
    close?.addEventListener('click', closeChat);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      pushMessage('user', text);
      input.value = '';
      setTimeout(() => pushMessage('bot', botReply(text)), 400);
    });
  }

  function initChart() {
    const ctx = document.getElementById('wellnessChart');
    if (!ctx) return;
    const now = new Date();
    const labels = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now);
      d.setMonth(now.getMonth() - (5 - i));
      return d.toLocaleString(undefined, { month: 'short' });
    });
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Anxiety mentions',
            data: [32, 36, 31, 28, 40, 37],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Sleep issues',
            data: [18, 22, 21, 25, 23, 26],
            borderColor: '#64748b',
            backgroundColor: 'rgba(100, 116, 139, 0.15)',
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', intersect: false },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 10 } }
        }
      }
    });
    return chart;
  }

  function initFooterYear() {
    const y = new Date().getFullYear();
    const el = document.getElementById('year');
    if (el) el.textContent = String(y);
  }

  window.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initBooking();
    initChatbot();
    initChart();
    initFooterYear();
  });
})(); 