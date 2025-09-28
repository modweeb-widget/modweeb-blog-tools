/**
 * أداة تحسين الصور - ModWeeb Image Optimizer
 * إصدار 2.0.0 - متوافق مع نظام ModWeeb الموحد
 */

(function() {
    'use strict';
    
    // تهيئة الكائن العام للأداة
    window.PU = window.PU || {};
    PU.ms = window.PU.ms || {
        linkCopiedToClipboard: "تم النسخ إلى الحافظة"
    };
    
    PU.tNtf = window.PU.tNtf || function(message) {
        // استخدام console.log بدلاً من alert للتنبيهات
        console.log('ModWeeb Image Optimizer:', message);
        
        // يمكن إضافة تنبيهات واجهة مستخدم هنا لاحقاً
        if (typeof showNotification === 'function') {
            showNotification(message);
        }
    };

    // العناصر الرئيسية
    const elements = {
        imgFile: document.getElementById("imgFile"),
        dropZone: document.getElementById("dropZone"),
        previewImg: document.getElementById("previewImg"),
        emptyPreview: document.getElementById("emptyPreview"),
        origSizeEl: document.getElementById("origSize"),
        resultSizeEl: document.getElementById("resultSize"),
        infoBox: document.getElementById("infoBox"),
        wmTypeSelect: document.getElementById("wmType"),
        textWatermarkControls: document.getElementById("textWatermarkControls"),
        barWatermarkControls: document.getElementById("barWatermarkControls"),
        wmBarBorderEnabled: document.getElementById("wmBarBorderEnabled"),
        wmBarBorderColorLabel: document.getElementById("wmBarBorderColorLabel"),
        wmBarGradientColorLabel: document.getElementById("wmBarGradientColorLabel"),
        wmBarGradientColor: document.getElementById("wmBarGradientColor"),
        centerOption: document.getElementById("centerOption"),
        downloadBtn: document.getElementById("downloadBtn"),
        previewOpenBtn: document.getElementById("previewOpenBtn"),
        resetBtn: document.getElementById("resetBtn"),
        processBtn: document.getElementById("processBtn"),
        widthInput: document.getElementById("widthInput"),
        heightInput: document.getElementById("heightInput"),
        keepAspect: document.getElementById("keepAspect")
    };

    // المتغيرات العامة
    let originalFile = null;
    let processedBlob = null;
    const originalImage = new Image();

    /**
     * تحويل البايتات إلى صيغة مقروءة
     */
    function formatBytes(bytes) {
        if (!bytes && bytes !== 0) return "-";
        if (bytes === 0) return "0 بايت";
        
        const k = 1024;
        const sizes = ["بايت", "ك.ب", "م.ب", "ج.ب"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    /**
     * معالجة الملف المرفوع
     */
    function handleFile(file) {
        if (!file) return;
        
        // التحقق من نوع الملف
        if (!file.type.startsWith("image/")) {
            PU.tNtf("الملف ليس صورة");
            return;
        }
        
        originalFile = file;
        elements.origSizeEl.innerText = formatBytes(file.size);
        
        const objectURL = URL.createObjectURL(file);
        elements.previewImg.src = objectURL;
        elements.previewImg.style.display = "block";
        elements.emptyPreview.style.display = "none";
        
        originalImage.onload = () => {
            // تعبئة حقول الأبعاد تلقائياً
            elements.widthInput.value = originalImage.width;
            elements.heightInput.value = originalImage.height;
            
            // عرض معلومات الصورة
            elements.infoBox.innerHTML = `
                <div>الأبعاد الأصلية: ${originalImage.width} × ${originalImage.height} بكسل</div>
                <div>نوع الملف: ${file.type}</div>
            `;
            
            // تحرير الذاكرة
            URL.revokeObjectURL(objectURL);
        };
        
        originalImage.src = objectURL;
    }

    /**
     * الحصول على امتداد الملف بناءً على نوع MIME
     */
    function getExtForMime(mimeType) {
        switch (mimeType) {
            case "image/png": return ".png";
            case "image/webp": return ".webp";
            default: return ".jpg";
        }
    }

    /**
     * تحميل الملف المحسن
     */
    function downloadBlob(blob, filename) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // تحرير الذاكرة بعد التحميل
        setTimeout(() => URL.revokeObjectURL(link.href), 2000);
        
        PU.tNtf("بدأ تحميل الصورة");
    }

    /**
     * معالجة الصورة مع الخيارات المحددة
     */
    async function processImage(image, options) {
        const {
            outFormat,
            quality,
            targetW,
            targetH,
            keepAspect,
            wmType,
            wmText,
            wmPos,
            wmSize,
            wmBarBgColor,
            wmBarGradientColor,
            wmBarBorderEnabled,
            wmBarBorderColor
        } = options;
        
        // الحصول على الأبعاد الأصلية
        let originalWidth = image.naturalWidth || image.width;
        let originalHeight = image.naturalHeight || image.height;
        
        // حساب الأبعاد الجديدة
        let newWidth = targetW || originalWidth;
        let newHeight = targetH || originalHeight;
        
        // الحفاظ على نسبة العرض إلى الارتفاع إذا مطلوب
        if (keepAspect) {
            if (targetW && !targetH) {
                newHeight = Math.round(targetW / originalWidth * originalHeight);
            } else if (targetH && !targetW) {
                newWidth = Math.round(targetH / originalHeight * originalWidth);
            } else if (targetW && targetH) {
                const scale = Math.min(targetW / originalWidth, targetH / originalHeight);
                newWidth = Math.round(originalWidth * scale);
                newHeight = Math.round(originalHeight * scale);
            }
        }
        
        // إنشاء canvas جديد
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, newWidth);
        canvas.height = Math.max(1, newHeight);
        
        const ctx = canvas.getContext("2d");
        
        // إعداد خلفية بيضاء للصور JPEG
        if (outFormat === "image/jpeg") {
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // تحسين جودة الرسم
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        
        // رسم الصورة المعدلة
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // إضافة العلامة المائية إذا وجدت
        if (wmText) {
            addWatermark(ctx, canvas, {
                wmType,
                wmText,
                wmPos,
                wmSize,
                wmBarBgColor,
                wmBarGradientColor,
                wmBarBorderEnabled,
                wmBarBorderColor
            });
        }
        
        // تحويل canvas إلى blob
        return await canvasToBlob(canvas, outFormat, quality);
    }

    /**
     * إضافة العلامة المائية إلى الصورة
     */
    function addWatermark(ctx, canvas, options) {
        const {
            wmType,
            wmText,
            wmPos,
            wmSize,
            wmBarBgColor,
            wmBarGradientColor,
            wmBarBorderEnabled,
            wmBarBorderColor
        } = options;
        
        ctx.save();
        ctx.globalAlpha = 0.75;
        
        const padding = 15;
        const fontSize = Math.max(12, wmSize);
        
        let x, y, width, height;
        
        // إعداد الخط
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        if (wmType !== "text") {
            // العلامات المائية ذات الخلفية
            const textWidth = ctx.measureText(wmText).width;
            height = fontSize + 2 * padding;
            width = textWidth + 2 * padding;
            
            const slantHeight = 20;
            
            // تحديد الموضع بناءً على الاختيار
            switch (wmPos) {
                case "bottom-right":
                    x = canvas.width - width;
                    y = canvas.height - height;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "top";
                    break;
                case "bottom-left":
                    x = 0;
                    y = canvas.height - height;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "top";
                    break;
                case "top-right":
                    x = canvas.width - width;
                    y = 0;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "top";
                    break;
                case "top-left":
                    x = 0;
                    y = 0;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "top";
                    break;
                case "center":
                    x = (canvas.width - width) / 2;
                    y = (canvas.height - height) / 2;
                    ctx.textAlign = "left";
                    ctx.textBaseline = "top";
                    break;
            }
            
            // رسم خلفية العلامة المائية
            drawWatermarkBackground(ctx, x, y, width, height, {
                wmType,
                wmBarBgColor,
                wmBarGradientColor,
                wmBarBorderEnabled,
                wmBarBorderColor,
                slantHeight
            });
            
            // إضافة النص
            let textX = x + padding;
            let textY = y + padding + 0.2 * fontSize;
            
            if (wmType === "slanted") {
                textX = x + padding + slantHeight / 2;
            }
            
            ctx.fillStyle = "#fff";
            ctx.fillText(wmText, textX, textY);
            
        } else {
            // علامة مائية نصية عادية
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.strokeStyle = "rgba(0,0,0,0.25)";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            
            const text = wmText;
            const textWidth = ctx.measureText(text).width;
            const textHeight = fontSize;
            
            // تحديد الموضع
            switch (wmPos) {
                case "bottom-right":
                    x = canvas.width - textWidth - 10;
                    y = canvas.height - 10;
                    break;
                case "bottom-left":
                    x = 10;
                    y = canvas.height - 10;
                    break;
                case "top-right":
                    x = canvas.width - textWidth - 10;
                    y = textHeight + 10;
                    break;
                case "top-left":
                    x = 10;
                    y = textHeight + 10;
                    break;
                case "center":
                    x = (canvas.width - textWidth) / 2;
                    y = (canvas.height + textHeight) / 2;
                    break;
            }
            
            // إضافة تأثير الظل والنص
            ctx.lineWidth = Math.max(2, Math.floor(fontSize / 8));
            ctx.strokeText(text, x, y);
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillText(text, x, y);
        }
        
        ctx.restore();
    }

    /**
     * رسم خلفية العلامة المائية
     */
    function drawWatermarkBackground(ctx, x, y, width, height, options) {
        const {
            wmType,
            wmBarBgColor,
            wmBarGradientColor,
            wmBarBorderEnabled,
            wmBarBorderColor,
            slantHeight
        } = options;
        
        const borderRadius = 10;
        
        switch (wmType) {
            case "rectangular":
                ctx.fillStyle = hexToRgba(wmBarBgColor, 0.75);
                ctx.fillRect(x, y, width, height);
                break;
                
            case "rounded":
                ctx.fillStyle = hexToRgba(wmBarBgColor, 0.75);
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, borderRadius);
                ctx.fill();
                
                if (wmBarBorderEnabled) {
                    ctx.strokeStyle = wmBarBorderColor;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                break;
                
            case "slanted":
                ctx.fillStyle = hexToRgba(wmBarBgColor, 0.75);
                ctx.beginPath();
                
                // تحديد اتجاه الميل بناءً على الموضع
                if (elements.wmPos.value === "bottom-right" || elements.wmPos.value === "top-right") {
                    ctx.moveTo(x + slantHeight, y);
                    ctx.lineTo(x + width, y);
                    ctx.lineTo(x + width - slantHeight, y + height);
                    ctx.lineTo(x, y + height);
                } else {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + width - slantHeight, y);
                    ctx.lineTo(x + width, y + height);
                    ctx.lineTo(x + slantHeight, y + height);
                }
                
                ctx.closePath();
                ctx.fill();
                
                if (wmBarBorderEnabled) {
                    ctx.strokeStyle = wmBarBorderColor;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                break;
                
            case "gradient":
                const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
                gradient.addColorStop(0, hexToRgba(wmBarBgColor, 0.75));
                gradient.addColorStop(1, hexToRgba(wmBarGradientColor, 0.75));
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, width, height);
                break;
        }
        
        // إضافة حدود للمستطيل والتدرج إذا مطلوب
        if (wmBarBorderEnabled && (wmType === "rectangular" || wmType === "gradient")) {
            ctx.strokeStyle = wmBarBorderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        }
    }

    /**
     * تحويل Canvas إلى Blob
     */
    function canvasToBlob(canvas, format, quality) {
        return new Promise((resolve, reject) => {
            const handleBlob = (blob) => {
                blob ? resolve(blob) : reject(new Error("toBlob returned null"));
            };
            
            if (canvas.toBlob) {
                try {
                    canvas.toBlob((blob) => {
                        if (!blob && format === "image/webp") {
                            // fallback لـ WebP غير المدعوم
                            canvas.toBlob(handleBlob, "image/jpeg", quality);
                        } else {
                            handleBlob(blob);
                        }
                    }, format, quality);
                } catch (error) {
                    // fallback في حالة الخطأ
                    canvas.toBlob(handleBlob, "image/jpeg", quality);
                }
            } else {
                // fallback للمتصفحات القديمة
                try {
                    const dataURL = canvas.toDataURL(format, quality).split(",");
                    const mimeType = dataURL[0].match(/:(.*?);/)[1];
                    const binaryData = atob(dataURL[1]);
                    const array = new Uint8Array(binaryData.length);
                    
                    for (let i = 0; i < binaryData.length; i++) {
                        array[i] = binaryData.charCodeAt(i);
                    }
                    
                    resolve(new Blob([array], { type: mimeType }));
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    /**
     * تحويل HEX إلى RGBA
     */
    function hexToRgba(hex, opacity = 1) {
        let r = 0, g = 0, b = 0;
        
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    /**
     * إضافة دالة roundRect للمتصفحات التي لا تدعمها
     */
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            if (typeof radius === 'number') {
                radius = {tl: radius, tr: radius, br: radius, bl: radius};
            } else {
                radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
            }
            
            this.beginPath();
            this.moveTo(x + radius.tl, y);
            this.lineTo(x + width - radius.tr, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
            this.lineTo(x + width, y + height - radius.br);
            this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            this.lineTo(x + radius.bl, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
            this.lineTo(x, y + radius.tl);
            this.quadraticCurveTo(x, y, x + radius.tl, y);
            this.closePath();
            return this;
        };
    }

    // ============================================================================
    // إعداد معالجات الأحداث
    // ============================================================================

    /**
     * معالجة سحب وإفلات الملفات
     */
    elements.dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        elements.dropZone.classList.add("dragover");
    });

    elements.dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove("dragover");
    });

    elements.dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove("dragover");
        
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            elements.imgFile.files = e.dataTransfer.files;
            handleFile(file);
            PU.tNtf("تم تحميل الصورة بنجاح");
        }
    });

    /**
     * معالجة اختيار الملف من المدخل
     */
    elements.imgFile.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        handleFile(file);
        if (file) {
            PU.tNtf("تم تحميل الصورة بنجاح");
        }
    });

    /**
     * إعادة ضبط الأداة
     */
    elements.resetBtn.addEventListener("click", () => {
        originalFile = null;
        processedBlob = null;
        elements.previewImg.src = "";
        elements.previewImg.style.display = "none";
        elements.emptyPreview.style.display = "block";
        elements.origSizeEl.innerText = "-";
        elements.resultSizeEl.innerText = "-";
        document.getElementById("resultFormat").innerText = "";
        elements.infoBox.innerText = "";
        elements.downloadBtn.disabled = true;
        elements.previewOpenBtn.disabled = true;
        elements.imgFile.value = "";
        elements.widthInput.value = "";
        elements.heightInput.value = "";
        document.getElementById("wmText").value = "";
        document.getElementById("quality").value = 85;
        document.getElementById("qv").innerText = "85";
        elements.wmTypeSelect.value = "text";
        elements.textWatermarkControls.style.display = "block";
        elements.barWatermarkControls.style.display = "none";
        elements.centerOption.style.display = "block";
        elements.wmBarGradientColorLabel.style.display = "none";
        elements.keepAspect.checked = true;
        
        PU.tNtf("تم إعادة الضبط");
    });

    /**
     * معالجة الصورة
     */
    elements.processBtn.addEventListener("click", async () => {
        if (!originalFile) {
            PU.tNtf("من فضلك ارفع صورة أولاً");
            return;
        }
        
        // جمع الخيارات من الواجهة
        const options = {
            outFormat: document.getElementById("outFormat").value || "image/jpeg",
            quality: Math.max(0.2, Math.min(1, (parseInt(document.getElementById("quality").value) || 85) / 100)),
            targetW: parseInt(elements.widthInput.value) || null,
            targetH: parseInt(elements.heightInput.value) || null,
            keepAspect: elements.keepAspect.checked,
            wmType: elements.wmTypeSelect.value,
            wmText: (document.getElementById("wmText").value || "").trim(),
            wmPos: document.getElementById("wmPos").value || "bottom-right",
            wmSize: parseInt(document.getElementById("wmSize").value) || 20,
            wmBarBgColor: document.getElementById("wmBarBgColor").value,
            wmBarGradientColor: document.getElementById("wmBarGradientColor").value,
            wmBarBorderEnabled: elements.wmBarBorderEnabled.checked,
            wmBarBorderColor: document.getElementById("wmBarBorderColor").value
        };
        
        elements.infoBox.innerText = "جاري معالجة الصورة...";
        elements.processBtn.disabled = true;
        
        try {
            const processedBlob = await processImage(originalImage, options);
            
            // تحديث الواجهة بنتائج المعالجة
            updateUIAfterProcessing(processedBlob, options.outFormat);
            
        } catch (error) {
            console.error("Error processing image:", error);
            PU.tNtf("حدث خطأ أثناء معالجة الصورة");
            elements.infoBox.innerText = "حدث خطأ أثناء المعالجة";
        } finally {
            elements.processBtn.disabled = false;
        }
    });

    /**
     * تحديث الواجهة بعد المعالجة
     */
    function updateUIAfterProcessing(blob, outFormat) {
        processedBlob = blob;
        elements.resultSizeEl.innerText = formatBytes(blob.size);
        elements.downloadBtn.disabled = false;
        elements.previewOpenBtn.disabled = false;
        
        // إعداد معاينة الصورة المحسنة
        const previewURL = URL.createObjectURL(blob);
        elements.previewImg.src = previewURL;
        elements.previewImg.style.display = "block";
        elements.emptyPreview.style.display = "none";
        
        // إعداد زر التحميل
        elements.downloadBtn.onclick = () => {
            downloadBlob(blob, `optimized${getExtForMime(outFormat)}`);
        };
        
        // إعداد زر المعاينة
        elements.previewOpenBtn.onclick = () => {
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        };
        
        // عرض معلومات النتيجة
        document.getElementById("resultFormat").innerHTML = `<strong>الصيغة:</strong> ${outFormat.split("/")[1].toUpperCase()}`;
        
        // حساب التوفير في الحجم
        const originalSize = originalFile.size;
        const processedSize = blob.size;
        const sizeSaved = originalSize - processedSize;
        const percentSaved = ((sizeSaved / originalSize) * 100).toFixed(1);
        
        elements.infoBox.innerHTML = sizeSaved > 0 ? 
            `تم تحسين الصورة بنجاح!<br>وفرت: ${formatBytes(sizeSaved)} (${percentSaved}%)` : 
            "تم معالجة الصورة بنجاح";
        
        PU.tNtf("تم تحسين الصورة بنجاح");
    }

    /**
     * معالجة تغيير أبعاد الصورة مع الحفاظ على النسبة
     */
    elements.widthInput.addEventListener("input", function() {
        if (elements.keepAspect.checked && originalImage.width && originalImage.height) {
            const aspectRatio = originalImage.height / originalImage.width;
            elements.heightInput.value = Math.round(this.value * aspectRatio);
        }
    });

    elements.heightInput.addEventListener("input", function() {
        if (elements.keepAspect.checked && originalImage.width && originalImage.height) {
            const aspectRatio = originalImage.width / originalImage.height;
            elements.widthInput.value = Math.round(this.value * aspectRatio);
        }
    });

    /**
     * إدارة عناصر التحكم في العلامة المائية
     */
    elements.wmTypeSelect.addEventListener("change", (e) => {
        const type = e.target.value;
        
        // إخفاء جميع عناصر التحكم أولاً
        elements.textWatermarkControls.style.display = "none";
        elements.barWatermarkControls.style.display = "none";
        elements.wmBarGradientColorLabel.style.display = "none";
        elements.wmBarBorderColorLabel.style.display = "none";
        
        // إظهار العناصر المناسبة للنوع المحدد
        if (type === "text") {
            elements.textWatermarkControls.style.display = "block";
            elements.centerOption.style.display = "block";
        } else {
            elements.barWatermarkControls.style.display = "block";
            elements.centerOption.style.display = "block";
            
            if (type === "gradient") {
                elements.wmBarGradientColorLabel.style.display = "block";
            }
            
            if (elements.wmBarBorderEnabled.checked) {
                elements.wmBarBorderColorLabel.style.display = "block";
            }
        }
    });

    /**
     * إدارة إظهار/إخفاء خيارات حدود العلامة المائية
     */
    elements.wmBarBorderEnabled.addEventListener("change", (e) => {
        elements.wmBarBorderColorLabel.style.display = e.target.checked ? "block" : "none";
    });

    // التهيئة الأولية
    elements.downloadBtn.disabled = true;
    elements.previewOpenBtn.disabled = true;
    
    // تطبيق الإعدادات الافتراضية للعلامة المائية
    elements.wmTypeSelect.dispatchEvent(new Event("change"));
    
    // إضافة فئة إلى body للإشارة إلى تحميل الأداة
    document.body.classList.add('modweeb-image-optimizer-loaded');
    
    PU.tNtf("أداة تحسين الصور جاهزة للاستخدام");
})();
