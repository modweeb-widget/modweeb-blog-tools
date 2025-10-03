/* auth-system/thumbnail-generator/thumbnail.js */

// تحديد عناصر DOM الرئيسية
const previewArea = document.getElementById('imagePreview');
const canvasWrapper = document.getElementById('canvasWrapper');
const titleInput = document.getElementById('title');
const logoFileInput = document.getElementById('logoFile');
const logoUrlInput = document.getElementById('logoUrl');
const logoImage = document.getElementById('logoImage');
const downloadBtn = document.getElementById('downloadBtn');
const addTextBtn = document.getElementById('addTextBtn');

let currentTextElement = null;
let textCounter = 1;
let initialMouseX, initialMouseY, initialTextX, initialTextY;

// --- 1. الدوال الأساسية والمساعدة ---

/**
 * تطبيق جميع الإعدادات الحالية من حقول الإدخال على منطقة المعاينة (canvasWrapper).
 */
function applySettings() {
    const canvasWidth = document.getElementById('canvasWidth').value + 'px';
    const canvasHeight = document.getElementById('canvasHeight').value + 'px';
    const backgroundColor = document.getElementById('bgColor').value;
    const padding = document.getElementById('padding').value + 'px';
    const borderRadius = document.getElementById('borderRadius').value + 'px';
    const backgroundOpacity = document.getElementById('bgOpacity').value / 100;

    // تطبيق إعدادات الإطار الرئيسي
    canvasWrapper.style.width = canvasWidth;
    canvasWrapper.style.height = canvasHeight;
    canvasWrapper.style.padding = padding;
    canvasWrapper.style.borderRadius = borderRadius;
    canvasWrapper.style.backgroundColor = backgroundColor;
    canvasWrapper.style.opacity = backgroundOpacity;

    // تحديث إعدادات النصوص
    document.querySelectorAll('.text-element').forEach(el => {
        // تحديث العنوان الرئيسي
        if (el.dataset.type === 'mainTitle') {
            el.style.fontSize = document.getElementById('titleSize').value + 'px';
            el.style.color = document.getElementById('titleColor').value;
            el.style.fontWeight = document.getElementById('titleWeight').value;
            el.style.lineHeight = document.getElementById('titleLineHeight').value;
            el.style.fontFamily = document.getElementById('titleFont').value;
        // تحديث النصوص المضافة
        } else if (el.dataset.type === 'customText') {
            el.style.fontSize = document.getElementById('textSize').value + 'px';
            el.style.color = document.getElementById('textColor').value;
            el.style.fontWeight = document.getElementById('textWeight').value;
            el.style.lineHeight = document.getElementById('textLineHeight').value;
            el.style.fontFamily = document.getElementById('textFont').value;
        }
    });

    // تحديث إعدادات الشعار
    const logoSize = document.getElementById('logoSize').value + 'px';
    logoImage.style.width = logoSize;
    logoImage.style.height = logoSize;
    logoImage.style.borderRadius = document.getElementById('logoRadius').value + 'px';
    logoImage.style.opacity = document.getElementById('logoOpacity').value / 100;
    
    // إخفاء/إظهار الشعار بناءً على وجود مصدر له
    if (logoImage.src) {
        logoImage.style.display = 'block';
    } else {
        logoImage.style.display = 'none';
    }
}

/**
 * إعداد وظيفة السحب والإفلات لعنصر معين.
 * @param {HTMLElement} element - العنصر المراد جعله قابلاً للسحب.
 */
function setupDraggable(element) {
    const startDrag = (e) => {
        e.preventDefault();
        
        // إزالة التحديد من جميع العناصر وتحديد العنصر الحالي
        document.querySelectorAll('.text-element').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        currentTextElement = element;

        // تحديد موضع الفأرة الأولي وموقع العنصر النسبي لـ canvasWrapper
        initialMouseX = e.clientX || e.touches[0].clientX;
        initialMouseY = e.clientY || e.touches[0].clientY;
        
        const rect = element.getBoundingClientRect();
        const wrapperRect = canvasWrapper.getBoundingClientRect();

        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        initialTextX = elementCenterX - wrapperRect.left;
        initialTextY = elementCenterY - wrapperRect.top;

        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', stopDrag, false);
        document.addEventListener('touchmove', drag, false);
        document.addEventListener('touchend', stopDrag, false);
    };

    const drag = (e) => {
        e.preventDefault();
        if (!currentTextElement) return;

        const currentMouseX = e.clientX || e.touches[0].clientX;
        const currentMouseY = e.clientY || e.touches[0].clientY;
        
        const dx = currentMouseX - initialMouseX;
        const dy = currentMouseY - initialMouseY;
        
        let newX = initialTextX + dx;
        let newY = initialTextY + dy;

        // تحويل الموقع إلى نسبة مئوية بالنسبة لحجم الإطار
        const wrapperWidth = canvasWrapper.clientWidth;
        const wrapperHeight = canvasWrapper.clientHeight;

        let newXPercentage = (newX / wrapperWidth) * 100;
        let newYPercentage = (newY / wrapperHeight) * 100;

        currentTextElement.style.left = `${newXPercentage}%`;
        currentTextElement.style.top = `${newYPercentage}%`;
    };

    const stopDrag = () => {
        document.removeEventListener('mousemove', drag, false);
        document.removeEventListener('mouseup', stopDrag, false);
        document.removeEventListener('touchmove', drag, false);
        document.removeEventListener('touchend', stopDrag, false);
        currentTextElement = null; 
    };

    element.addEventListener('mousedown', startDrag, false);
    element.addEventListener('touchstart', startDrag, false);
    
    // النقر المزدوج للتعديل أو الحذف
    element.addEventListener('dblclick', (e) => {
        e.stopPropagation(); 
        if (e.target.closest('.text-element')) {
            editText(element);
        }
    });
    
    // النقر مرة واحدة للتحديد
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.text-element').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        currentTextElement = element;
    });
}

/**
 * تعديل نص عنصر معين أو حذفه.
 * @param {HTMLElement} element - العنصر النصي المراد تعديله.
 */
function editText(element) {
    const currentText = element.innerText;
    const newText = prompt("تعديل النص:", currentText);
    if (newText !== null && newText.trim() !== "") {
        element.innerText = newText.trim();
        element.dataset.text = newText.trim();
    } else if (newText === "") {
        if (confirm("هل تريد حذف هذا العنصر النصي؟")) {
            element.remove();
            currentTextElement = null;
        }
    }
}

// --- 2. التعامل مع الشعار والصور ---

function handleLogoFile() {
    if (logoFileInput.files.length > 0) {
        const file = logoFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            logoImage.src = e.target.result;
            logoUrlInput.value = ''; // مسح رابط URL
            applySettings();
        };
        reader.readAsDataURL(file);
    }
}

function handleLogoUrl() {
    const url = logoUrlInput.value.trim();
    if (url) {
        logoImage.src = url;
        logoFileInput.value = ''; // مسح ملف الإدخال
        applySettings();
    } else if (!logoFileInput.files.length) {
        logoImage.src = ''; 
        applySettings(); 
    }
}

// --- 3. التعامل مع عناصر النص ---

function updateTitleElement() {
    let titleElement = document.querySelector('.text-element[data-type="mainTitle"]');
    const newTitle = titleInput.value.trim();

    if (!titleElement && newTitle) {
        titleElement = document.createElement('div');
        titleElement.className = 'text-element';
        titleElement.dataset.type = 'mainTitle';
        titleElement.dataset.text = newTitle;
        titleElement.style.left = '50%';
        titleElement.style.top = '50%';
        canvasWrapper.appendChild(titleElement);
        setupDraggable(titleElement);
    }

    if (titleElement) {
        titleElement.innerText = newTitle;
        titleElement.dataset.text = newTitle;
        if (!newTitle) {
            titleElement.remove();
        }
    }
    applySettings();
}

function addCustomText() {
    const initialText = prompt("أدخل النص المخصص:", `نص مخصص ${textCounter}`);
    if (initialText && initialText.trim() !== "") {
        const textElement = document.createElement('div');
        textElement.className = 'text-element';
        textElement.dataset.type = 'customText';
        textElement.dataset.text = initialText.trim();
        textElement.innerText = initialText.trim();
        textElement.id = `customText-${textCounter}`;
        
        // تعيين موقع مبدئي
        textElement.style.left = '55%';
        textElement.style.top = '55%';

        canvasWrapper.appendChild(textElement);
        setupDraggable(textElement);
        applySettings();
        textCounter++;
    }
}

// --- 4. وظيفة التحميل (html2canvas) ---

function downloadThumbnail() {
    // 1. إزالة أي تحديد من العناصر النصية قبل التصوير
    document.querySelectorAll('.text-element').forEach(el => el.classList.remove('selected'));
    currentTextElement = null; 

    // 2. استنساخ عنصر الإطار لتصويره بدقة عالية
    const tempCanvasWrapper = canvasWrapper.cloneNode(true);
    
    // تطبيق الأبعاد الدقيقة للعرض والارتفاع على الاستنساخ
    tempCanvasWrapper.style.width = document.getElementById('canvasWidth').value + 'px';
    tempCanvasWrapper.style.height = document.getElementById('canvasHeight').value + 'px';
    
    // 3. تطبيق النمط الدقيق (الذي قد يتأثر بإعدادات القالب)
    tempCanvasWrapper.querySelectorAll('.text-element').forEach(el => {
        const originalEl = canvasWrapper.querySelector(`#${el.id}`);
        if (originalEl) {
            el.style.cssText = originalEl.style.cssText;
        }
    });

    // 4. إرفاق الاستنساخ بالجسم مؤقتاً لعملية التصوير
    document.body.appendChild(tempCanvasWrapper);

    // 5. استخدام html2canvas لالتقاط المحتوى
    html2canvas(tempCanvasWrapper, {
        scale: 3, // تكبير المقياس لدقة أعلى (3x)
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null 
    }).then(canvas => {
        // 6. إنشاء رابط التحميل
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = 'modweeb-thumbnail.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 7. التنظيف (إزالة العنصر المؤقت وإعادة تطبيق الإعدادات)
        document.body.removeChild(tempCanvasWrapper);
        applySettings(); 
    }).catch(error => {
        console.error("Error during image capture:", error);
        alert('حدث خطأ أثناء إنشاء الصورة. تأكد من أن جميع الصور المحملة ليس لها قيود CORS.');
        document.body.removeChild(tempCanvasWrapper); 
        applySettings();
    });
}

// --- 5. مستمعي الأحداث والتهيئة ---

function initThumbnailGenerator() {
    // التطبيق الأولي للإعدادات الافتراضية
    applySettings();

    // مستمعي الأحداث لتحديث المعاينة عند تغيير أي مدخل
    document.querySelectorAll('.input, .color-input input, input[type="range"], select').forEach(input => {
        input.addEventListener('input', applySettings);
    });

    // مستمعي الأحداث المحددة
    titleInput.addEventListener('input', updateTitleElement);
    logoFileInput.addEventListener('change', handleLogoFile);
    logoUrlInput.addEventListener('input', handleLogoUrl);
    downloadBtn.addEventListener('click', downloadThumbnail);
    addTextBtn.addEventListener('click', addCustomText);
    
    // إلغاء التحديد عند النقر خارج العناصر النصية
    canvasWrapper.addEventListener('click', (e) => {
        if (e.target.id === 'canvasWrapper' || e.target.id === 'imagePreview') {
            document.querySelectorAll('.text-element').forEach(el => el.classList.remove('selected'));
            currentTextElement = null;
        }
    });


    // تحديث عرض قيمة حقول النطاق (Range Inputs)
    document.querySelectorAll('input[type="range"]').forEach(range => {
        const valueSpan = document.getElementById(`${range.id}Value`);
        
        // تعيين القيمة الأولية
        if (valueSpan) {
             valueSpan.textContent = `${range.value}${range.id.includes('Opacity') ? '%' : (range.id.includes('LineHeight') ? '' : 'px')}`;
        }
        
        range.addEventListener('input', function() {
            if (valueSpan) {
                // عرض القيمة مع الوحدة المناسبة
                valueSpan.textContent = `${range.value}${range.id.includes('Opacity') ? '%' : (range.id.includes('LineHeight') ? '' : 'px')}`;
            }
        });
    });
    
    // تحديث عرض قيمة مدخلات الألوان
    document.querySelectorAll('.color-input input[type="color"]').forEach(colorInput => {
        const displaySpan = colorInput.closest('.color-input').querySelector('.color-display');
        colorInput.addEventListener('input', function() {
            if (displaySpan) {
                displaySpan.textContent = this.value.toUpperCase();
            }
        });
        // تعيين العرض الأولي
        if (displaySpan) {
            displaySpan.textContent = colorInput.value.toUpperCase();
        }
    });


    // وظيفة التبويبات (Tabs)
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // وظيفة الأكورديون (Accordion)
    document.querySelectorAll('.accordion__header').forEach(header => {
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            const content = this.nextElementSibling;
            content.setAttribute('aria-hidden', isExpanded);
            if (isExpanded) {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
        // عرض المحتوى الأولي إذا كان موسعاً
        if (header.getAttribute('aria-expanded') === 'true') {
            header.nextElementSibling.style.display = 'block';
        } else {
            header.nextElementSibling.style.display = 'none';
        }
    });

    // التحكم في أحجام الإطارات (+/- buttons)
    document.querySelectorAll('.size-control__btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            const target = this.dataset.target;
            const valueElement = document.getElementById(`${target}Value`);
            const hiddenInput = document.getElementById(target);
            let currentSize = parseInt(hiddenInput.value); 

            if (action === 'increase') {
                currentSize += 1;
            } else {
                currentSize = Math.max(parseInt(hiddenInput.min), currentSize - 1); 
            }

            hiddenInput.value = currentSize;
            valueElement.textContent = currentSize + 'px';
            applySettings(); 
        });
    });

    // إعداد العنوان الأولي
    updateTitleElement();
}

/**
 * التأكد من أن DOM جاهز وأن html2canvas قد تم تحميله قبل تهيئة الأداة.
 */
document.addEventListener('DOMContentLoaded', () => {
    // بما أننا نستخدم thumbnail-min.js، فإننا نعتمد على أن جميع العناصر أصبحت موجودة
    // عند تشغيل هذا السكربت.
    if (typeof html2canvas !== 'undefined') {
        initThumbnailGenerator();
    } else {
        // حل احتياطي إذا كان هناك تأخير في تحميل المكتبة
        window.addEventListener('load', initThumbnailGenerator);
    }
});
