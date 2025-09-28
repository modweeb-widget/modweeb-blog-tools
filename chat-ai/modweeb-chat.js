function modweebChat(options) {
    const HUGGING_FACE_TOKEN = options.config.hfToken;
    const HUGGING_FACE_MODEL = options.config.hfModel;
    const USAGE_KEY = "modweebChatUsage_v1",
          HISTORY_KEY = "modweebChatHistory_v1",
          DEFAULT_DAILY_LIMIT = 25,
          DEV_FLAG_KEY = "modweebDevUnlimited_v1";

    // وظائف المساعدة
    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#39;");
    }

    function isSafeUrl(url) {
        try {
            let parsedUrl = new URL(url, location.href);
            return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
        } catch (error) {
            return false;
        }
    }

    function renderRichText(text) {
        let html = escapeHtml(text);
        
        // معالجة العناوين
        html = html.replace(/^#{1,6}\s+(.*)$/gm, (match, title) => 
            `<b style="display:block; margin:15px 0 8px 0; color:var(--linkC, #3b82f6);">${title.trim()}</b>`
        );

        // معالجة القوائم
        let listCounter = 0;
        html = html.replace(/^[*\-]\s+(.*)$/gm, (match, item) => {
            listCounter++;
            let number = listCounter <= 10 ? ["١","٢","٣","٤","٥","٦","٧","٨","٩","١٠"][listCounter-1] : listCounter + ".";
            return `${number} ${item.trim()}<br>`;
        });

        // معالجة الصور
        html = html.replace(/!\[([^\]]*?)\]\((.*?)\)/g, (match, alt, src) => 
            isSafeUrl(src.trim()) ? 
            `<img src="${src.trim()}" alt="${escapeHtml(alt)}" loading="lazy" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;">` : 
            escapeHtml(match)
        );

        // معالجة الروابط
        html = html.replace(/\[([^\]]+)\]\((.*?)\)/g, (match, text, href) => 
            isSafeUrl(href.trim()) ? 
            `<a href="${href.trim()}" target="_blank" rel="noopener noreferrer" style="color:var(--linkC, #3b82f6); text-decoration:underline;">${escapeHtml(text)}</a>` : 
            escapeHtml(match)
        );

        // معالجة التنسيق
        html = html.replace(/`([^`]+)`/g, (match, code) => 
            `<code style="background:var(--contentBa, #f8fafc); padding:2px 6px; border-radius:4px; border:1px solid var(--contentL, #e2e8f0);">${escapeHtml(code)}</code>`
        );

        html = html.replace(/\*\*(.*?)\*\*/g, (match, bold) => 
            `<b style="font-weight:600;">${escapeHtml(bold)}</b>`
        );

        html = html.replace(/\*(.*?)\*/g, (match, italic) => 
            `<i style="font-style:italic;">${escapeHtml(italic)}</i>`
        );

        // معالجة الأسطر
        html = html.replace(/\n\n+/g, "<br><br>")
                  .replace(/\n/g, "<br>")
                  .replace(/(<br>){3,}/g, "<br><br>");

        return html;
    }

    // إدارة الاستخدام
    function loadUsage() {
        try {
            let usage = localStorage.getItem(USAGE_KEY);
            if (!usage) return initUsage();
            
            let data = JSON.parse(usage);
            let today = new Date().toISOString().slice(0, 10);
            
            if (data.date !== today) return initUsage();
            return data;
        } catch (error) {
            return initUsage();
        }
    }

    function initUsage() {
        let today = new Date().toISOString().slice(0, 10);
        let usage = { date: today, count: 0, limit: DEFAULT_DAILY_LIMIT };
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
        return usage;
    }

    function saveUsage(usage) {
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    }

    function remainingMessages() {
        let isDev = localStorage.getItem(DEV_FLAG_KEY) === "1";
        if (isDev) return Infinity;
        
        let usage = loadUsage();
        return Math.max(0, usage.limit - usage.count);
    }

    function refreshUsageUI() {
        let remaining = remainingMessages();
        document.getElementById("modweeb-remaining").textContent = 
            remaining === Infinity ? "غير محدود" : `الرسائل المتبقية: ${remaining}`;
    }

    // إدارة المحادثة
    let messagesLoaded = false;

    function saveHistory() {
        try {
            let messages = [...document.getElementById("modweeb-messages").children];
            let history = messages.map(msg => ({
                role: msg.classList.contains("modweeb-msg-user") ? "user" : "assistant",
                html: msg.querySelector(".bubble") ? msg.querySelector(".bubble").innerHTML : msg.innerHTML
            }));
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (error) {}
    }

    function restoreHistory() {
        try {
            let history = localStorage.getItem(HISTORY_KEY);
            if (!history) return;
            
            let messages = JSON.parse(history);
            let container = document.getElementById("modweeb-messages");
            container.innerHTML = "";
            
            messages.forEach(msg => {
                let messageDiv = document.createElement("div");
                messageDiv.className = msg.role === "user" ? "modweeb-msg-user" : "modweeb-msg-ai";
                
                let bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.innerHTML = msg.html;
                messageDiv.appendChild(bubble);
                
                if (msg.role === "assistant") {
                    let meta = document.createElement("div");
                    meta.className = "meta";
                    meta.innerHTML = `<div class="msg-controls">
                        <button class="copy-reply" title="نسخ الرد">نسخ</button>
                    </div>`;
                    messageDiv.appendChild(meta);
                }
                
                container.appendChild(messageDiv);
            });
            
            messagesLoaded = true;
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        } catch (error) {}
    }

    function showStatus(message, duration = 1600) {
        let status = document.getElementById("modweeb-status");
        status.style.display = "block";
        status.textContent = message;
        
        if (duration > 0) {
            setTimeout(() => {
                status.style.display = "none";
            }, duration);
        }
    }

    // إنشاء الرسائل
    function createUserMessage(text) {
        let messageDiv = document.createElement("div");
        messageDiv.className = "modweeb-msg-user";
        
        let bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = renderRichText(text);
        messageDiv.appendChild(bubble);
        
        let meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<div class="msg-controls">
            <button class="edit-user" title="تعديل">✎</button>
        </div>`;
        messageDiv.appendChild(meta);
        
        document.getElementById("modweeb-messages").appendChild(messageDiv);
        return messageDiv;
    }

    function createAiPlaceholder() {
        let messageDiv = document.createElement("div");
        messageDiv.className = "modweeb-msg-ai";
        
        let bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = `<div style="display:flex;align-items:center;gap:8px;">
            <div class="spinner" aria-hidden="true"></div>
            جاري الكتابة...
        </div>`;
        messageDiv.appendChild(bubble);
        
        let meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<div class="msg-controls">
            <button class="copy-reply" title="نسخ الرد">نسخ</button>
            <button class="resend-retry" title="إعادة المحاولة" style="display:none">إعادة</button>
        </div>`;
        messageDiv.appendChild(meta);
        
        document.getElementById("modweeb-messages").appendChild(messageDiv);
        document.getElementById("modweeb-messages").scrollTop = document.getElementById("modweeb-messages").scrollHeight;
        return messageDiv;
    }

    function buildConversationPayload(newMessage) {
        let messages = [...document.getElementById("modweeb-messages").children];
        let conversation = [
            { role: "system", content: "أنت مساعد تقني لمدونة modweeb.com، أجِب بشكل مختصر وعملي واحترافي." }
        ];
        
        messages.forEach(msg => {
            let isUser = msg.classList.contains("modweeb-msg-user");
            let bubble = msg.querySelector(".bubble");
            if (!bubble) return;
            
            let text = bubble.innerText || bubble.textContent || "";
            conversation.push({
                role: isUser ? "user" : "assistant",
                content: text
            });
        });
        
        if (newMessage) {
            conversation.push({ role: "user", content: newMessage });
        }
        
        return conversation;
    }

    async function sendMessage(message, aiMessageElement = null, isRetry = false) {
        let isDev = localStorage.getItem(DEV_FLAG_KEY) === "1";
        if (!isDev) {
            let usage = loadUsage();
            if (usage.count >= usage.limit) {
                showStatus("تم تجاوز الحد اليومي للرسائل");
                return false;
            }
        }
        
        let aiMessage = aiMessageElement || createAiPlaceholder();
        showStatus("جاري إرسال الرسالة...");
        
        let conversation = buildConversationPayload(message);
        
        try {
            let response = await fetch("https://router.huggingface.co/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: HUGGING_FACE_MODEL,
                    messages: conversation,
                    max_tokens: 1000,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });
            
            if (!response.ok) throw new Error("network");
            
            let data = await response.json();
            let content = data?.choices?.[0]?.message?.content || "❌ حدث خطأ.";
            let formattedContent = renderRichText(content);
            
            let bubble = aiMessage.querySelector(".bubble");
            if (bubble) {
                bubble.innerHTML = formattedContent;
            }
            
            let retryBtn = aiMessage.querySelector(".resend-retry");
            if (retryBtn) {
                retryBtn.style.display = "none";
            }
            
            // تحديث الاستخدام
            let usage = loadUsage();
            usage.count = (usage.count || 0) + 1;
            saveUsage(usage);
            refreshUsageUI();
            saveHistory();
            
            showStatus("تم الرد بنجاح!");
            return true;
            
        } catch (error) {
            let bubble = aiMessage.querySelector(".bubble");
            if (bubble) {
                bubble.innerHTML = `<div style="color:#ef4444;">❌ تعذر استجابة المساعد</div>`;
            }
            
            let retryBtn = aiMessage.querySelector(".resend-retry");
            if (retryBtn) {
                retryBtn.style.display = "inline-block";
                retryBtn.onclick = async function() {
                    retryBtn.disabled = true;
                    retryBtn.textContent = "...";
                    bubble.innerHTML = `<div style="display:flex;align-items:center;gap:8px;">
                        <div class="spinner"></div>
                        إعادة المحاولة...
                    </div>`;
                    
                    await sendMessage(message, aiMessage, true);
                    retryBtn.disabled = false;
                    retryBtn.textContent = "إعادة";
                };
            }
            
            saveHistory();
            showStatus("تعذر الاتصال بالخادم");
            return false;
        }
    }

    function lazyLoadMessages() {
        if (!messagesLoaded) {
            let welcomeMsg = document.createElement("div");
            welcomeMsg.className = "modweeb-msg-ai";
            
            let bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.innerHTML = `👋 مرحبًا بك في دردشة <b>modweeb.com</b>! كيف أساعدك؟`;
            welcomeMsg.appendChild(bubble);
            
            let meta = document.createElement("div");
            meta.className = "meta";
            meta.innerHTML = `<div class="msg-controls">
                <button class="copy-reply" title="نسخ الرد">نسخ</button>
            </div>`;
            welcomeMsg.appendChild(meta);
            
            document.getElementById("modweeb-messages").appendChild(welcomeMsg);
            messagesLoaded = true;
            
            setTimeout(() => {
                document.getElementById("modweeb-messages").scrollTop = document.getElementById("modweeb-messages").scrollHeight;
            }, 100);
        }
    }

    // إعداد واجهة المستخدم
    const container = document.getElementById("modweeb-chat-container");
    const input = document.getElementById("modweeb-input");
    const charsUI = document.getElementById("modweeb-chars");

    // أحداث الواجهة
    document.getElementById("modweeb-chat-btn").onclick = function() {
        container.style.display = "flex";
        container.style.right = "32px";
        container.style.bottom = "142px";
        lazyLoadMessages();
        setTimeout(() => input.focus(), 100);
        refreshUsageUI();
        restoreHistory();
    };

    document.getElementById("modweeb-chat-close").onclick = function() {
        container.style.display = "none";
    };

    input.addEventListener("input", function(e) {
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 62) + "px";
        charsUI.textContent = `${e.target.value.length} أحرف`;
    });

    input.addEventListener("keydown", function(e) {
        if ((e.key === "Enter" && !e.shiftKey) || ((e.ctrlKey || e.metaKey) && e.key === "Enter")) {
            e.preventDefault();
            document.getElementById("modweeb-send").click();
            return;
        }
        
        if (e.key === "ArrowUp" && input.value.trim() === "") {
            let messages = [...document.getElementById("modweeb-messages").children].reverse();
            let lastUserMsg = messages.find(msg => msg.classList.contains("modweeb-msg-user"));
            if (lastUserMsg) {
                let text = lastUserMsg.querySelector(".bubble").innerText || "";
                input.value = text;
                input.dispatchEvent(new Event("input"));
            }
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            container.style.display = "none";
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            container.style.display = "flex";
            setTimeout(() => input.focus(), 100);
        }
    });

    document.querySelectorAll(".modweeb-suggestion-btn").forEach(btn => {
        btn.onclick = () => {
            input.value = btn.textContent;
            input.focus();
            input.dispatchEvent(new Event("input"));
        };
    });

    document.getElementById("modweeb-copy-all").onclick = function() {
        let messages = [...document.getElementById("modweeb-messages").children]
            .map(msg => msg.innerText)
            .join("\n");
        navigator.clipboard.writeText(messages).then(() => {
            showStatus("تم نسخ المحادثة!");
        });
    };

    document.getElementById("modweeb-clear").onclick = function() {
        localStorage.removeItem(HISTORY_KEY);
        document.getElementById("modweeb-messages").innerHTML = "";
        messagesLoaded = false;
        lazyLoadMessages();
        showStatus("تم حذف المحادثة!");
    };

    document.getElementById("modweeb-messages").addEventListener("click", function(e) {
        let target = e.target;
        
        if (target.closest(".copy-reply")) {
            let aiMsg = target.closest(".modweeb-msg-ai");
            if (!aiMsg) return;
            let text = aiMsg.querySelector(".bubble").innerText || "";
            navigator.clipboard.writeText(text).then(() => {
                showStatus("تم نسخ الرد!");
            });
        }
        
        if (target.closest(".edit-user")) {
            let userMsg = target.closest(".modweeb-msg-user");
            if (!userMsg) return;
            let text = userMsg.querySelector(".bubble").innerText || "";
            input.value = text;
            input.focus();
            input.dispatchEvent(new Event("input"));
        }
    });

    document.getElementById("modweeb-send").onclick = async function() {
        let message = input.value.trim();
        if (!message) return;
        
        let isDev = localStorage.getItem(DEV_FLAG_KEY) === "1";
        if (!isDev) {
            let usage = loadUsage();
            if (usage.count >= usage.limit) {
                showStatus("تم تجاوز الحد اليومي للرسائل");
                return;
            }
        }
        
        createUserMessage(message);
        input.value = "";
        input.style.height = "auto";
        charsUI.textContent = "0 أحرف";
        
        let aiMessage = createAiPlaceholder();
        document.getElementById("modweeb-messages").scrollTop = document.getElementById("modweeb-messages").scrollHeight;
        saveHistory();
        
        await sendMessage(message, aiMessage);
    };

    // وضع المطور
    let headerClickCount = 0;
    let headerClickTimer = null;
    const head = document.getElementById("modweeb-head");

    head.addEventListener("click", function(e) {
        headerClickCount++;
        if (headerClickTimer) clearTimeout(headerClickTimer);
        headerClickTimer = setTimeout(() => { headerClickCount = 0; }, 4000);
        
        if (headerClickCount >= 5) {
            headerClickCount = 0;
            let isDev = localStorage.getItem(DEV_FLAG_KEY) === "1";
            if (isDev) {
                localStorage.removeItem(DEV_FLAG_KEY);
                showStatus("وضع المطور معطل");
            } else {
                localStorage.setItem(DEV_FLAG_KEY, "1");
                showStatus("وضع المطور مفعل: غير محدود");
            }
            refreshUsageUI();
        }
    });

    // التهيئة النهائية
    document.getElementById("modweeb-messages").style.minHeight = "60px";
    restoreHistory();
    refreshUsageUI();
}
