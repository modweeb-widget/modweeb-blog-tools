// الأنماط المتاحة
const patterns = {
    dots: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='20' cy='20' r='2' fill='{color}'/><circle cx='50' cy='20' r='2' fill='{color}'/><circle cx='80' cy='20' r='2' fill='{color}'/><circle cx='20' cy='50' r='2' fill='{color}'/><circle cx='50' cy='50' r='2' fill='{color}'/><circle cx='80' cy='50' r='2' fill='{color}'/><circle cx='20' cy='80' r='2' fill='{color}'/><circle cx='50' cy='80' r='2' fill='{color}'/><circle cx='80' cy='80' r='2' fill='{color}'/></svg>`,
    waves: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><path d='M0,50 C20,70 40,30 60,50 S80,30 100,50 L100,100 L0,100 Z' fill='{color}'/></svg>`,
    lines: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><line x1='0' y1='20' x2='100' y2='20' stroke='{color}' stroke-width='1'/><line x1='0' y1='40' x2='100' y2='40' stroke='{color}' stroke-width='1'/><line x1='0' y1='60' x2='100' y2='60' stroke='{color}' stroke-width='1'/><line x1='0' y1='80' x2='100' y2='80' stroke='{color}' stroke-width='1'/></svg>`,
    grid: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><path d='M 0 50 L 100 50 M 50 0 L 50 100' stroke='{color}' stroke-width='1'/></svg>`,
    circles: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='20' cy='20' r='10' fill='none' stroke='{color}' stroke-width='1'/><circle cx='80' cy='20' r='10' fill='none' stroke='{color}' stroke-width='1'/><circle cx='50' cy='50' r='10' fill='none' stroke='{color}' stroke-width='1'/><circle cx='20' cy='80' r='10' fill='none' stroke='{color}' stroke-width='1'/><circle cx='80' cy='80' r='10' fill='none' stroke='{color}' stroke-width='1'/></svg>`,
    none: 'none'
};

// المتغيرات العامة
let currentPattern = 'dots';
let uploadedLogo = null;
let uploadedBgImage = null;

// تهيئة الأداة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initThumbnailGenerator();
});

// تهيئة مولد الصور المصغرة
function initThumbnailGenerator() {
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');
    
    // تهيئة المستمعين للأحداث
    setupEventListeners();
    
    // تعيين التاريخ الحالي
    setCurrentDate();
    
    // إنشاء الصورة الأولى
    generateThumbnail();
}

// إعداد المستمعين للأحداث
function setupEventListeners() {
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');
    
    // العناصر الرئيسية
    const titleInput = document.getElementById('title');
    const excerptInput = document.getElementById('excerpt');
    const authorInput = document.getElementById('author');
    const blogNameInput = document.getElementById('blogName');
    const logoInput = document.getElementById('logo');
    const bgColorInput = document.getElementById('bgColor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadJpgBtn = document.getElementById('downloadJpgBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadWebpBtn = document.getElementById('downloadWebpBtn');
    const resetBtn = document.getElementById('resetBtn');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    const bgOpacityInput = document.getElementById('bgOpacity');
    const bgOpacityValue = document.getElementById('bgOpacityValue');
    const publishDateInput = document.getElementById('publishDate');
    const patternOpacityInput = document.getElementById('patternOpacity');
    const patternOpacityValue = document.getElementById('patternOpacityValue');
    
    // ألوان النصوص
    const titleColorInput = document.getElementById('titleColor');
    const excerptColorInput = document.getElementById('excerptColor');
    const authorColorInput = document.getElementById('authorColor');
    const blogNameColorInput = document.getElementById('blogNameColor');
    const patternColorInput = document.getElementById('patternColor');
    
    // أحجام النصوص
    const titleSizeInput = document.getElementById('titleSize');
    const titleSizeValue = document.getElementById('titleSizeValue');
    const excerptSizeInput = document.getElementById('excerptSize');
    const excerptSizeValue = document.getElementById('excerptSizeValue');
    const authorSizeInput = document.getElementById('authorSize');
    const authorSizeValue = document.getElementById('authorSizeValue');
    const blogNameSizeInput = document.getElementById('blogNameSize');
    const blogNameSizeValue = document.getElementById('blogNameSizeValue');
    
    // خلفية الصورة
    const bgImageInput = document.getElementById('bgImage');
    const customBgImageColorInput = document.getElementById('customBgImageColor');
    
    // أنماط الزخرفة
    const patternOptions = document.getElementById('patternOptions');
    
    // مستمعي الأحداث للأنماط
    patternOptions.addEventListener('click', function(e) {
        const patternOption = e.target.closest('.tb-pattern-option');
        if (patternOption) {
            document.querySelectorAll('.tb-pattern-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            patternOption.classList.add('selected');
            currentPattern = patternOption.dataset.pattern;
            generateThumbnail();
        }
    });
    
    // شفافية النمط
    patternOpacityInput.addEventListener('input', function() {
        patternOpacityValue.textContent = this.value + '%';
        generateThumbnail();
    });
    
    // أحجام النصوص
    titleSizeInput.addEventListener('input', function() {
        titleSizeValue.textContent = this.value + 'px';
        generateThumbnail();
    });
    
    excerptSizeInput.addEventListener('input', function() {
        excerptSizeValue.textContent = this.value + 'px';
        generateThumbnail();
    });
    
    authorSizeInput.addEventListener('input', function() {
        authorSizeValue.textContent = this.value + 'px';
        generateThumbnail();
    });
    
    blogNameSizeInput.addEventListener('input', function() {
        blogNameSizeValue.textContent = this.value + 'px';
        generateThumbnail();
    });
    
    // شفافية الخلفية
    bgOpacityInput.addEventListener('input', function() {
        bgOpacityValue.textContent = this.value + '%';
        generateThumbnail();
    });
    
    // نسبة الأبعاد
    aspectRatioSelect.addEventListener('change', function() {
        updateCanvasSize();
        generateThumbnail();
    });
    
    // تحميل صورة الخلفية
    bgImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedBgImage = new Image();
                uploadedBgImage.onload = function() {
                    generateThumbnail();
                };
                uploadedBgImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // تحميل الشعار
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedLogo = new Image();
                uploadedLogo.onload = function() {
                    generateThumbnail();
                };
                uploadedLogo.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // الأزرار الرئيسية
    generateBtn.addEventListener('click', generateThumbnail);
    downloadJpgBtn.addEventListener('click', () => downloadThumbnail('jpg'));
    downloadPngBtn.addEventListener('click', () => downloadThumbnail('png'));
    downloadWebpBtn.addEventListener('click', () => downloadThumbnail('webp'));
    resetBtn.addEventListener('click', resetSettings);
    
    // نوع لون خلفية الصورة
    document.querySelectorAll('input[name="bgImageColorType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const customBgImageColorGroup = document.getElementById('customBgImageColorGroup');
            customBgImageColorGroup.style.display = this.value === 'custom' ? 'block' : 'none';
            generateThumbnail();
        });
    });
    
    // تحديث الصورة عند تغيير المدخلات
    const inputsToWatch = [
        titleInput, excerptInput, authorInput, blogNameInput,
        bgColorInput, titleColorInput, excerptColorInput, 
        authorColorInput, blogNameColorInput, patternColorInput,
        customBgImageColorInput, publishDateInput
    ];
    
    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('input', generateThumbnail);
        }
    });
    
    // تغيير الخط
    document.getElementById('fontSelect').addEventListener('change', generateThumbnail);
}

// تعيين التاريخ الحالي
function setCurrentDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('publishDate').value = formattedDate;
}

// تحديث حجم Canvas بناءً على نسبة الأبعاد
function updateCanvasSize() {
    const canvas = document.getElementById('thumbnailCanvas');
    const ratio = document.getElementById('aspectRatio').value;
    const [widthRatio, heightRatio] = ratio.split('/').map(Number);
    const newWidth = 800;
    const newHeight = Math.round(newWidth * heightRatio / widthRatio);
    canvas.width = newWidth;
    canvas.height = newHeight;
}

// إنشاء الصورة المصغرة
function generateThumbnail() {
    const canvas = document.getElementById('thumbnailCanvas');
    const ctx = canvas.getContext('2d');
    
    // الحصول على القيم من المدخلات
    const title = document.getElementById('title').value || "عنوان المقال";
    const excerpt = document.getElementById('excerpt').value || "مقتطف المقال يظهر هنا...";
    const author = document.getElementById('author').value || "اسم المؤلف";
    const blogName = document.getElementById('blogName').value || "اسم المدونة";
    const bgColor = document.getElementById('bgColor').value;
    const patternColor = document.getElementById('patternColor').value;
    const selectedFont = document.getElementById('fontSelect').value;
    const bgOpacity = document.getElementById('bgOpacity').value / 100;
    const titleColor = document.getElementById('titleColor').value;
    const excerptColor = document.getElementById('excerptColor').value;
    const authorColor = document.getElementById('authorColor').value;
    const blogNameColor = document.getElementById('blogNameColor').value;
    const titleSize = parseInt(document.getElementById('titleSize').value);
    const excerptSize = parseInt(document.getElementById('excerptSize').value);
    const authorSize = parseInt(document.getElementById('authorSize').value);
    const blogNameSize = parseInt(document.getElementById('blogNameSize').value);
    const bgImageColorType = document.querySelector('input[name="bgImageColorType"]:checked').value;
    const customBgImageColorInput = document.getElementById('customBgImageColor');
    const bgImageEffectColor = bgImageColorType === 'custom' ? customBgImageColorInput.value : patternColor;
    const publishDate = new Date(document.getElementById('publishDate').value);
    const arabicDate = formatArabicDate(publishDate);
    const patternOpacity = document.getElementById('patternOpacity').value / 100;
    
    // مسح Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم الخلفية الأساسية
    ctx.save();
    ctx.globalAlpha = bgOpacity;
    ctx.fillStyle = lightenColor(bgColor, 90);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // رسم النمط إذا كان مختاراً
    if (currentPattern !== 'none') {
        const patternImg = new Image();
        patternImg.onload = function() {
            const pattern = ctx.createPattern(patternImg, 'repeat');
            ctx.save();
            ctx.globalAlpha = patternOpacity;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            drawImageAndContent();
        };
        const patternWithColor = patterns[currentPattern].replace(/{color}/g, encodeURIComponent(patternColor));
        patternImg.src = patternWithColor;
    } else {
        drawImageAndContent();
    }
    
    function drawImageAndContent() {
        // رسم صورة الخلفية إذا كانت موجودة
        if (uploadedBgImage) {
            ctx.save();
            ctx.globalAlpha = bgOpacity;
            ctx.drawImage(uploadedBgImage, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgImageEffectColor;
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        drawContent();
    }
    
    function drawContent() {
        // رسم الشعار واسم المدونة
        if (uploadedLogo) {
            const logoSize = 60;
            const logoX = canvas.width - logoSize - 30;
            const logoY = 30;
            
            // تأثير ظل للشعار
            ctx.save();
            ctx.beginPath();
            ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            ctx.fill();
            ctx.restore();
            
            // رسم الشعار
            ctx.drawImage(uploadedLogo, logoX, logoY, logoSize, logoSize);
            
            // اسم المدونة
            ctx.font = `bold ${blogNameSize}px ${selectedFont}`;
            ctx.fillStyle = blogNameColor;
            ctx.textAlign = 'right';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 5;
            
            const maxBlogNameWidth = 400;
            const blogNameMetrics = ctx.measureText(blogName);
            
            if (blogNameMetrics.width > maxBlogNameWidth) {
                const words = blogName.split(' ');
                let line1 = '';
                let line2 = '';
                let part = 0;
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = (part === 0 ? line1 : line2) + words[i] + ' ';
                    const testWidth = ctx.measureText(testLine).width;
                    
                    if (testWidth <= maxBlogNameWidth) {
                        if (part === 0) {
                            line1 = testLine;
                        } else {
                            line2 = testLine;
                        }
                    } else {
                        if (part === 0) {
                            part = 1;
                            line2 = words[i] + ' ';
                        } else {
                            break;
                        }
                    }
                }
                
                ctx.fillText(line1.trim(), logoX - 20, logoY + logoSize / 2);
                ctx.fillText(line2.trim(), logoX - 20, logoY + logoSize / 2 + blogNameSize + 5);
            } else {
                ctx.fillText(blogName, logoX - 20, logoY + logoSize / 2 + 10);
            }
        } else if (blogName) {
            // اسم المدونة بدون شعار
            ctx.font = `bold ${blogNameSize}px ${selectedFont}`;
            ctx.fillStyle = blogNameColor;
            ctx.textAlign = 'right';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 5;
            ctx.fillText(blogName, canvas.width - 30, 70);
        }
        
        // المؤلف والتاريخ
        ctx.font = `italic ${authorSize}px ${selectedFont}`;
        ctx.fillStyle = authorColor;
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 1;
        
        const authorX = canvas.width - 200;
        const authorY = canvas.height - 40;
        
        // أيقونة المؤلف
        ctx.save();
        ctx.font = `16px 'Segoe UI Emoji','Noto Color Emoji'`;
        ctx.fillText('👤', authorX - 40, authorY);
        ctx.restore();
        
        // اسم المؤلف
        ctx.fillText(author, authorX - 20, authorY);
        
        // أيقونة التاريخ
        ctx.save();
        ctx.font = `16px 'Segoe UI Emoji','Noto Color Emoji'`;
        ctx.fillText('📅', authorX + ctx.measureText(author).width - 5, authorY);
        ctx.restore();
        
        // التاريخ
        ctx.fillText(arabicDate, authorX + ctx.measureText(author).width + 25, authorY);
        
        // العنوان
        ctx.fillStyle = titleColor;
        ctx.font = `bold ${titleSize}px ${selectedFont}`;
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        
        const titleX = canvas.width - 60;
        const titleY = 160;
        const titleLineHeight = titleSize + 10;
        
        const titleHeight = wrapTitleText(ctx, title, titleX, titleY, canvas.width - 110, titleLineHeight);
        
        // المقتطف
        ctx.fillStyle = excerptColor;
        ctx.font = `${excerptSize}px ${selectedFont}`;
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 3;
        
        const excerptX = canvas.width - 60;
        const excerptMaxWidth = canvas.width - 120;
        const excerptStartY = titleY + titleHeight + 20;
        
        wrapTextModern(ctx, excerpt, excerptX, excerptStartY, excerptMaxWidth, excerptSize + 6);
    }
    
    drawImageAndContent();
}

// تفكيك النص إلى أسطر للعنوان
function wrapTitleText(ctx, text, x, y, maxWidth, lineHeight = 40, maxLines = 2) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';
    
    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth <= maxWidth && lines.length < maxLines - 1) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
            if (lines.length === maxLines - 1) {
                let finalLine = currentLine;
                while (ctx.measureText(finalLine + '...').width > maxWidth && finalLine.length > 0) {
                    finalLine = finalLine.slice(0, -1);
                }
                lines.push(finalLine + '...');
                break;
            }
        }
    }
    
    if (lines.length < maxLines && currentLine && !lines.includes(currentLine)) {
        lines.push(currentLine);
    }
    
    const totalLines = lines.length;
    const offsetY = totalLines === 2 ? lineHeight / 2 : 0;
    const startY = y - offsetY;
    
    for (let i = 0; i < totalLines; i++) {
        ctx.fillText(lines[i], x, startY + (i * lineHeight));
    }
    
    return totalLines * lineHeight;
}

// تفكيك النص إلى أسطر للمقتطف
function wrapTextModern(context, text, x, y, maxWidth, lineHeight = 30) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const metrics = context.measureText(testLine);
        
        if (metrics.width <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    
    lines.push(currentLine);
    
    const maxVisibleLines = 4;
    const visibleLines = lines.slice(0, maxVisibleLines);
    
    if (lines.length > maxVisibleLines) {
        let lastLine = visibleLines[visibleLines.length - 1];
        while (context.measureText(lastLine + '...').width > maxWidth && lastLine.length > 0) {
            lastLine = lastLine.slice(0, -1);
        }
        visibleLines[visibleLines.length - 1] = lastLine + '...';
    }
    
    for (let i = 0; i < visibleLines.length; i++) {
        context.fillText(visibleLines[i], x, y + (i * lineHeight));
    }
}

// تنسيق التاريخ بالعربية
function formatArabicDate(date) {
    if (isNaN(date.getTime())) return 'تاريخ غير محدد';
    
    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// تحميل الصورة
function downloadThumbnail(format = 'png') {
    const canvas = document.getElementById('thumbnailCanvas');
    
    let mimeType, fileExtension;
    switch (format) {
        case 'jpg':
            mimeType = 'image/jpeg';
            fileExtension = 'jpg';
            break;
        case 'png':
            mimeType = 'image/png';
            fileExtension = 'png';
            break;
        case 'webp':
            mimeType = 'image/webp';
            fileExtension = 'webp';
            break;
        default:
            mimeType = 'image/png';
            fileExtension = 'png';
    }
    
    const link = document.createElement('a');
    link.download = `thumbnail-${Date.now()}.${fileExtension}`;
    link.href = canvas.toDataURL(mimeType, 0.9);
    link.click();
}

// إعادة التعيين
function resetSettings() {
    document.getElementById('title').value = '';
    document.getElementById('excerpt').value = '';
    document.getElementById('author').value = '';
    document.getElementById('blogName').value = '';
    document.getElementById('logo').value = '';
    document.getElementById('bgColor').value = '#4a6fa5';
    document.getElementById('titleColor').value = '#333333';
    document.getElementById('excerptColor').value = '#333333';
    document.getElementById('authorColor').value = '#333333';
    document.getElementById('blogNameColor').value = '#333333';
    document.getElementById('patternColor').value = '#4a6fa5';
    
    document.getElementById('titleSize').value = 40;
    document.getElementById('excerptSize').value = 26;
    document.getElementById('authorSize').value = 15;
    document.getElementById('blogNameSize').value = 24;
    
    document.getElementById('titleSizeValue').textContent = '40px';
    document.getElementById('excerptSizeValue').textContent = '26px';
    document.getElementById('authorSizeValue').textContent = '15px';
    document.getElementById('blogNameSizeValue').textContent = '24px';
    
    document.getElementById('bgOpacity').value = 90;
    document.getElementById('bgOpacityValue').textContent = '90%';
    
    document.getElementById('fontSelect').selectedIndex = 0;
    document.getElementById('aspectRatio').selectedIndex = 0;
    
    document.querySelector('input[name="bgImageColorType"][value="pattern"]').checked = true;
    document.getElementById('customBgImageColorGroup').style.display = 'none';
    
    uploadedLogo = null;
    uploadedBgImage = null;
    document.getElementById('bgImage').value = '';
    
    currentPattern = 'dots';
    document.querySelectorAll('.tb-pattern-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector('.tb-pattern-option[data-pattern="dots"]').classList.add('selected');
    
    document.getElementById('patternOpacity').value = 20;
    document.getElementById('patternOpacityValue').textContent = '20%';
    
    setCurrentDate();
    updateCanvasSize();
    generateThumbnail();
}

// تفتيح اللون
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

// تحويل HEX إلى RGBA
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// وظائف إضافية للواجهة
function setActiveTab(tabNumber) {
    const tabsContainer = document.querySelector('.settings-tabs');
    tabsContainer.setAttribute('data-active-tab', tabNumber);
    
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        if (index === tabNumber - 1) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach((content, index) => {
        if (index === tabNumber - 1) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// إعداد المستمعين الإضافيين
document.addEventListener('DOMContentLoaded', function() {
    // تحديث قيم المدخلات من نوع range
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', () => {
            const valueSpan = document.getElementById(`${range.id}Value`);
            if (valueSpan) {
                valueSpan.textContent = `${range.value}${range.id.includes('Opacity') ? '%' : 'px'}`;
            }
        });
    });
    
    // التنقل بين التبويبات
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = e.currentTarget.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // الأكورديون
    const accordionHeader = document.querySelector('.accordion__header');
    const accordionContent = document.querySelector('.accordion__content');
    
    if (accordionHeader && accordionContent) {
        accordionHeader.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            accordionContent.setAttribute('aria-hidden', isExpanded);
            
            if (isExpanded) {
                accordionContent.style.display = 'none';
            } else {
                accordionContent.style.display = 'block';
            }
        });
    }
    
    // أزرار التحكم في الحجم
    document.querySelectorAll('.size-control__btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action;
            const target = this.dataset.target;
            const valueElement = document.getElementById(`${target}Value`);
            const hiddenInput = document.getElementById(target);
            
            let currentSize = parseInt(valueElement.textContent);
            
            if (action === 'increase') {
                currentSize += 1;
            } else {
                currentSize = Math.max(1, currentSize - 1);
            }
            
            valueElement.textContent = currentSize + 'px';
            hiddenInput.value = currentSize;
            generateThumbnail();
        });
    });
});
