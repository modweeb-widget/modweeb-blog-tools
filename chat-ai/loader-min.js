/*
 * ModWeeb Chat Loader - النسخة المصغرة
 * يقوم بتحميل الأنماط والهيكل وتهيئة الدردشة باستخدام المفتاح المشفر
 */
!function(){
    const s = document.currentScript;
    const key = s.getAttribute('data-api-key');
    if (!key) return console.error('ModWeeb Chat: Missing data-api-key.');

    // فك تشفير المفتاح مباشرة
    let hfToken;
    try {
        hfToken = atob(key);
    } catch(e) {
        return console.error('ModWeeb Chat: Invalid Base64 API Key.');
    }
    
    const baseURL = "https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-blog-tools@main/chat-ai";
    const head = document.head;
    const body = document.body;

    // 1. تحميل الأنماط الأساسية الموحدة (ملاحظة: هذا الكود لا يتضمن core-styles/main.css، يجب إضافته يدويًا)
    // لتصغير الكود أكثر، قمنا بحذف استدعاء core-styles/main.css ويجب أن يتأكد المستخدم من وجوده في القالب.
    
    // 2. تحميل أنماط الدردشة
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `${baseURL}/modweeb-chat.css`;
    head.appendChild(css);

    // 3. إنشاء هيكل HTML (تم استخدام HTML المصغر الخاص بك)
    const btnHtml = '<svg class=modweeb-svg-btn-n viewbox="0 0 24 24"><path d="M21.49 12C21.81 10.98 22 9.88 22 8.69C22 5.6 19.51 3.09998 16.44 3.09998C14.62 3.09998 13.01 3.98003 12 5.34003C10.99 3.98003 9.37 3.09998 7.56 3.09998C4.49 3.09998 2 5.6 2 8.69C2 15.69 8.48 19.82 11.38 20.82C11.55 20.88 11.77 20.91 12 20.91"></path><path d="M19.21 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.82 15.13 19.21 15.74Z" stroke-miterlimit=10></path><path d="M18.7001 16.25C19.0001 17.33 19.8401 18.17 20.9201 18.47" stroke-miterlimit=10></path></svg>';
    const chatHtml = '<div id=modweeb-chat-container role=dialog aria-label="دردشة الذكاء الاصطناعي"><div class="modweeb-integrations"><span id="modweeb-remaining" style="color:var(--textC);">الرسائل المتبقية: 25</span><span class="modweeb-privacy" onclick="modweebTrackEvent(\'privacy_clicked\')" style="color:var(--textC); opacity: 0.8;"><svg viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modweeb-integr-icon" style="width: 14px; height: 14px; margin-left: 4px;"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>الخصوصية والاستخدام</span></div><div class=modweeb-head id=modweeb-head><span><svg viewbox="0 0 514 514" class="logo-icon modweeb-logo-chat"><path fill="rgba(225,20,98,0.9)" d="M195 167.9c-3.4 1.7-8 7.3-28 33.2l-8.8 11.5 14 18.2 14 18.2 3.8-3.4c6.6-6 14.2-7 21.3-2.8 2.5 1.5 19 22.2 68 85.9 6.5 8.4 13 16 14.5 17.1 6.5 4.5 15.5 5.5 20.2 2.2 2.7-1.9 43-53 43-54.5a301 301 0 0 0-24.2-30.3c-.5.2-5.5 6.4-11.1 13.7-9.5 12.4-13 16.2-14 15L273 247c-58.8-76.2-59.3-76.8-63.1-79a15.7 15.7 0 0 0-15-.1" /><path fill="rgba(111,202,220,0.9)" d="M104 180.4c-2 1.3-4.8 4.6-6.3 7.4-5.7 10.6-4.6 20.3 3.7 31C182 322.5 204.4 351 206.1 352c7 3.7 12.7 2.8 18-2.8a948 948 0 0 0 29.2-37c.6-.8-3-6-11.3-16.8L230 280l-4.5 3.2c-8.6 6.1-19.4 4.8-27-3.4-1.7-1.8-19.4-24.3-39.3-50a1327.4 1327.4 0 0 0-39.2-49.2c-4.1-3.5-11-3.6-16-.2" /><path fill="rgba(61,184,143,0.9)" d="M312 173.6c-2 1.2-35.7 43.5-42.7 53.4-1 1.5.4 3.8 10.3 16.6l12.4 15.7a87 87 0 0 0 13-15c6.7-8.7 12.8-15.8 13.5-15.8 1.3 0 39 47.6 44.2 56a950 950 0 0 0 35.7 45.4c3 2.4 10.8 2.6 15.2.3 10-5.1 16.2-17.1 13.4-25.6-.6-1.9-9.5-14.3-19.8-27.5L362.5 220a1046 1046 0 0 1-29-38.4c-4.1-6.6-8.5-9.5-14.4-9.5-2.5 0-5.7.8-7.1 1.6" /><path fill="rgba(233,169,32,0.9)" d="M106.8 282.6c-24.2 31.2-24.8 32-26.3 36.4a26.2 26.2 0 0 0 4.1 24.5c4.7 6.2 12 8.2 18.3 5a830 830 0 0 0 43.3-54c.6-1.1-21.2-30.7-23.2-31.4a191 191 0 0 0-16.2 19.5m298.8-118c-3 .8-8.8 4.8-12.2 8.4a446.8 446.8 0 0 0-26.1 38c-.3 1.1 4 7.6 11.4 17.3 11 14.7 11.9 15.5 13.3 13.7l14-20a4025 4025 0 0 1 16.2-23.3c8.5-12 7-28.6-2.9-33.3a26 26 0 0 0-13.7-.8" /></svg><span>مساعد ModWeeb AI</span></span><div style="display:flex;align-items:center;gap:6px"><button id="modweeb-copy-all" title="نسخ المحادثة" class="modweeb-head-btn"><svg class="modweeb-svg-h" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M13 15H9V5H13"></path><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button><button id="modweeb-clear" title="حذف المحادثة" class="modweeb-head-btn"><svg class="modweeb-svg-h" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-8 6v4m4-4v4" /></svg></button><button id="modweeb-chat-close" title="إغلاق الدردشة" class="modweeb-head-btn"><svg viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div></div><div id="modweeb-status"></div><div id="modweeb-messages"></div><div class="modweeb-suggestions"><button class="modweeb-suggestion-btn">ما هو أفضل قالب بلوجر؟</button><button class="modweeb-suggestion-btn">ما هي أحدث أدواتكم؟</button></div><div class="modweeb-input-wrap"><textarea id="modweeb-input" placeholder="اكتب سؤالك هنا..." rows="1"></textarea><button id="modweeb-send">إرسال<svg viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button></div><div class="modweeb-usage" id="modweeb-usage"><span id="modweeb-chars">0 أحرف</span></div></div>';
    
    // إنشاء الحاويات
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'modweeb-widget-container';
    widgetContainer.innerHTML = chatHtml;

    const chatBtn = document.createElement('button');
    chatBtn.id = 'modweeb-chat-btn';
    chatBtn.type = 'button';
    chatBtn.className = 'modweeb-chat-btn';
    chatBtn.setAttribute('aria-label', 'فتح الدردشة');
    chatBtn.title = 'ابدأ دردشة AI';
    chatBtn.innerHTML = btnHtml;

    // إضافة العناصر إلى الصفحة
    document.body.appendChild(chatBtn);
    document.body.appendChild(widgetContainer);

    // 4. تحميل سكربت الدردشة وتهيئته
    const script = document.createElement('script');
    script.src = `${baseURL}/modweeb-chat.js`;
    script.onload = function() {
        if (typeof modweebChat === 'function') {
            modweebChat({
                config: {
                    hfToken: hfToken, // المفتاح مفكوك التشفير
                    hfModel: 'google/gemma-2-9b-it:nebius'
                }
            });
        }
    };
    body.appendChild(script);

}();
