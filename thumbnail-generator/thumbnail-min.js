/* auth-system/thumbnail-generator/thumbnail-min.js */
(function() {
    // 1. تعريف مُعرِّف العنصر النائب
    const CONTAINER_ID = 'thumbnail-tool-container';
    const container = document.getElementById(CONTAINER_ID);

    if (!container) {
        console.error(`Error: Placeholder div with ID '${CONTAINER_ID}' not found. Tool cannot be loaded.`);
        return;
    }

    // 2. تعريف هيكل الأداة (بدون روابط خارجية)
    const thumbnailStructure = `
        <div class="heroBox">
            <div class="BoxTool">
                <div class="thumbnail-generator-container">
                    <div class="editor">
                        <div class="tb-form-container">
                            <div class="settings-tabs" data-active-tab="1">
                                <button class="tab-btn active" data-tab="basic"> الأساسية </button>
                                <button class="tab-btn" data-tab="design"> التصميم </button>
                                <button class="tab-btn" data-tab="colors"> الألوان </button>
                            </div>

                            <div class="tab-content active" id="basic-tab">
                                <div class="form-section">
                                    <p class="dt"> المعلومات الأساسية </p>
                                    <div class="form-group">
                                        <label for="title">عنوان الصورة المصغرة</label>
                                        <textarea id="title" class="input" placeholder="أدخل هنا عنوان الموضوع أو المقالة"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="logoFile">صورة الشعار (ملف)</label>
                                        <input type="file" id="logoFile" accept="image/*" class="input">
                                    </div>
                                    <div class="form-group">
                                        <label for="logoUrl">صورة الشعار (رابط مباشر)</label>
                                        <input type="url" id="logoUrl" class="input" placeholder="https://example.com/logo.png">
                                    </div>
                                    <button id="addTextBtn" class="btn btn-secondary w-full">إضافة نص مخصص جديد</button>
                                </div>
                            </div>

                            <div class="tab-content" id="design-tab">
                                <div class="accordion">
                                    <div class="accordion__header" aria-expanded="true" aria-controls="canvasSettingsContent">
                                        إعدادات إطار الصورة
                                        <svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    <div class="accordion__content" id="canvasSettingsContent" aria-hidden="false" style="display: block;">
                                        <div class="range-group">
                                            <label for="canvasWidth">عرض الإطار</label>
                                            <input type="range" id="canvasWidth" min="300" max="1500" value="1200">
                                            <span class="range-value" id="canvasWidthValue">1200px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="canvasHeight">ارتفاع الإطار</label>
                                            <input type="range" id="canvasHeight" min="200" max="1000" value="630">
                                            <span class="range-value" id="canvasHeightValue">630px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="padding">الهامش الداخلي</label>
                                            <input type="range" id="padding" min="0" max="100" value="30">
                                            <span class="range-value" id="paddingValue">30px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="borderRadius">انحناء الزوايا</label>
                                            <input type="range" id="borderRadius" min="0" max="50" value="15">
                                            <span class="range-value" id="borderRadiusValue">15px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="bgOpacity">شفافية الخلفية</label>
                                            <input type="range" id="bgOpacity" min="0" max="100" value="100">
                                            <span class="range-value" id="bgOpacityValue">100%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="accordion">
                                    <div class="accordion__header" aria-expanded="true" aria-controls="titleSettingsContent">
                                        إعدادات عنوان الصورة (العنوان الرئيسي)
                                        <svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    <div class="accordion__content" id="titleSettingsContent" aria-hidden="false" style="display: block;">
                                        <div class="form-group">
                                            <label for="titleFont">الخط</label>
                                            <select id="titleFont" class="input">
                                                <option value="Arial, sans-serif">Arial</option>
                                                <option value="'Droid Arabic Kufi', sans-serif">Droid Arabic Kufi</option>
                                                <option value="Tahoma, sans-serif">Tahoma</option>
                                                <option value="system-ui, sans-serif">System Default</option>
                                            </select>
                                        </div>
                                        <div class="range-group">
                                            <label for="titleSize">حجم الخط</label>
                                            <input type="range" id="titleSize" min="20" max="100" value="48">
                                            <span class="range-value" id="titleSizeValue">48px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="titleWeight">سمك الخط</label>
                                            <select id="titleWeight" class="input">
                                                <option value="400">عادي (400)</option>
                                                <option value="600">شبه عريض (600)</option>
                                                <option value="700" selected>عريض (700)</option>
                                                <option value="900">أسود (900)</option>
                                            </select>
                                        </div>
                                        <div class="range-group">
                                            <label for="titleLineHeight">تباعد الأسطر</label>
                                            <input type="range" id="titleLineHeight" min="1" max="2" step="0.1" value="1.2">
                                            <span class="range-value" id="titleLineHeightValue">1.2</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="accordion">
                                    <div class="accordion__header" aria-expanded="true" aria-controls="textSettingsContent">
                                        إعدادات النصوص المضافة
                                        <svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    <div class="accordion__content" id="textSettingsContent" aria-hidden="false" style="display: block;">
                                        <div class="form-group">
                                            <label for="textFont">الخط</label>
                                            <select id="textFont" class="input">
                                                <option value="Arial, sans-serif">Arial</option>
                                                <option value="'Droid Arabic Kufi', sans-serif">Droid Arabic Kufi</option>
                                                <option value="Tahoma, sans-serif">Tahoma</option>
                                                <option value="system-ui, sans-serif" selected>System Default</option>
                                            </select>
                                        </div>
                                        <div class="range-group">
                                            <label for="textSize">حجم الخط</label>
                                            <input type="range" id="textSize" min="10" max="50" value="24">
                                            <span class="range-value" id="textSizeValue">24px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="textWeight">سمك الخط</label>
                                            <select id="textWeight" class="input">
                                                <option value="400" selected>عادي (400)</option>
                                                <option value="600">شبه عريض (600)</option>
                                                <option value="700">عريض (700)</option>
                                                <option value="900">أسود (900)</option>
                                            </select>
                                        </div>
                                        <div class="range-group">
                                            <label for="textLineHeight">تباعد الأسطر</label>
                                            <input type="range" id="textLineHeight" min="1" max="2" step="0.1" value="1.5">
                                            <span class="range-value" id="textLineHeightValue">1.5</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="accordion">
                                    <div class="accordion__header" aria-expanded="true" aria-controls="logoSettingsContent">
                                        إعدادات الشعار
                                        <svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    <div class="accordion__content" id="logoSettingsContent" aria-hidden="false" style="display: block;">
                                        <div class="range-group">
                                            <label for="logoSize">حجم الشعار</label>
                                            <input type="range" id="logoSize" min="10" max="200" value="80">
                                            <span class="range-value" id="logoSizeValue">80px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="logoRadius">انحناء الزوايا</label>
                                            <input type="range" id="logoRadius" min="0" max="100" value="50">
                                            <span class="range-value" id="logoRadiusValue">50px</span>
                                        </div>
                                        <div class="range-group">
                                            <label for="logoOpacity">شفافية الشعار</label>
                                            <input type="range" id="logoOpacity" min="0" max="100" value="100">
                                            <span class="range-value" id="logoOpacityValue">100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-content" id="colors-tab">
                                <div class="form-section">
                                    <p class="dt"> الألوان </p>
                                    <div class="form-group">
                                        <label for="bgColor">لون خلفية الإطار</label>
                                        <div class="color-input">
                                            <input type="color" id="bgColor" value="#ffffff">
                                            <span class="color-display">#ffffff</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="titleColor">لون العنوان الرئيسي</label>
                                        <div class="color-input">
                                            <input type="color" id="titleColor" value="#1f2937">
                                            <span class="color-display">#1f2937</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="textColor">لون النصوص المضافة</label>
                                        <div class="color-input">
                                            <input type="color" id="textColor" value="#4b5563">
                                            <span class="color-display">#4b5563</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button id="downloadBtn" class="btn btn-primary w-full mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path></svg>
                                تحميل الصورة المصغرة (PNG)
                            </button>
                        </div>
                    </div>

                    <div class="preview">
                        <div id="canvasWrapper" class="canvas-wrapper">
                            <img id="logoImage" src="" alt="Logo" style="display: none;"/>
                            <div id="imagePreview" style="width: 100%; height: 100%;">
                                </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-3">يمكنك سحب وإفلات العناصر النصية وتغيير حجمها من الإعدادات.</p>
                    </div>

                </div>
            </div>
        </div>
    `;

    // 3. دوال تحميل الموارد
    const loadScript = (src) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    };

    const loadCSS = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };
    
    // 4. تشغيل عملية الحقن
    
    // 4.1 حقن الموارد الخارجية في رأس الصفحة (لضمان التحميل الصحيح)
    loadScript("https://cdn.tailwindcss.com");
    loadScript("https://html2canvas.hertzen.com/dist/html2canvas.min.js");
    loadCSS("https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/thumbnail-generator/thumbnail.css");

    // 4.2 حقن الهيكل HTML داخل العنصر النائب الذي حدده المستخدم
    container.innerHTML = thumbnailStructure;
    
    // 4.3 تحميل سكربت المنطق الرئيسي (thumbnail.js) بعد ثواني بسيطة
    // لضمان وجود جميع عناصر HTML في DOM قبل أن يحاول السكربت الوصول إليها
    setTimeout(() => {
        loadScript("https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/thumbnail-generator/thumbnail.js");
    }, 50); 
})();
