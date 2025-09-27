window.PU = window.PU || {};
PU.ms = window.PU.ms || {
    linkCopiedToClipboard: "تم النسخ إلى الحافظة"
};
PU.tNtf = window.PU.tNtf || function (e) {
    alert(e)
};

const imgFile = document.getElementById("imgFile"),
    dropZone = document.getElementById("dropZone"),
    previewImg = document.getElementById("previewImg"),
    emptyPreview = document.getElementById("emptyPreview"),
    origSizeEl = document.getElementById("origSize"),
    resultSizeEl = document.getElementById("resultSize"),
    infoBox = document.getElementById("infoBox"),
    wmTypeSelect = document.getElementById("wmType"),
    textWatermarkControls = document.getElementById("textWatermarkControls"),
    barWatermarkControls = document.getElementById("barWatermarkControls"),
    wmBarBorderEnabled = document.getElementById("wmBarBorderEnabled"),
    wmBarBorderColorLabel = document.getElementById("wmBarBorderColorLabel"),
    wmBarGradientColorLabel = document.getElementById("wmBarGradientColorLabel"),
    wmBarGradientColor = document.getElementById("wmBarGradientColor"),
    centerOption = document.getElementById("centerOption"),
    downloadBtn = document.getElementById("downloadBtn"),
    previewOpenBtn = document.getElementById("previewOpenBtn"),
    resetBtn = document.getElementById("resetBtn"),
    processBtn = document.getElementById("processBtn"),
    widthInput = document.getElementById("widthInput"),
    heightInput = document.getElementById("heightInput"),
    keepAspect = document.getElementById("keepAspect");


let originalFile = null,
    processedBlob = null,
    originalImage = new Image;

function formatBytes(e) {
    if (!e && 0 !== e) return "-";
    if (0 === e) return "0 بايت";
    const t = Math.floor(Math.log(e) / Math.log(1024));
    return parseFloat((e / Math.pow(1024, t)).toFixed(2)) + " " + ["بايت", "ك.ب", "م.ب", "ج.ب"][t]
}

function handleFile(e) {
    if (!e) return;
    if (!e.type.startsWith("image/")) return void(PU && PU.tNtf && PU.tNtf("الملف ليس صورة"));
    originalFile = e, origSizeEl.innerText = formatBytes(e.size);
    const t = URL.createObjectURL(e);
    previewImg.src = t, previewImg.style.display = "block", emptyPreview.style.display = "none", originalImage.onload = () => {
        document.getElementById("widthInput").value = originalImage.width, document.getElementById("heightInput").value = originalImage.height, infoBox.innerHTML = `\n      <div>الأبعاد الأصلية: ${originalImage.width} × ${originalImage.height} بكسل</div>\n      <div>نوع الملف: ${e.type}</div>\n    `, URL.revokeObjectURL(t)
    }, originalImage.src = t
}

function getExtForMime(e) {
    return "image/png" === e ? ".png" : "image/webp" === e ? ".webp" : ".jpg"
}

function downloadBlob(e, t) {
    const n = document.createElement("a");
    n.href = URL.createObjectURL(e), n.download = t, document.body.appendChild(n), n.click(), n.remove(), setTimeout((() => URL.revokeObjectURL(n.href)), 2e3), PU && PU.tNtf && PU.tNtf("بدأ تحميل الصورة")
}

async function processImage(e, t) {
    const {
        outFormat: n,
        quality: o,
        targetW: l,
        targetH: r,
        keepAspect: i,
        wmType: a,
        wmText: d,
        wmPos: m,
        wmSize: s,
        wmBarBgColor: g,
        wmBarGradientColor: c,
        wmBarBorderEnabled: u,
        wmBarBorderColor: p
    } = t;
    let h = e.naturalWidth || e.width,
        y = e.naturalHeight || e.height,
        B = l || h,
        w = r || y;
    if (l && !r && i) w = Math.round(l / h * y);
    else if (r && !l && i) B = Math.round(r / y * h);
    else if (l && r && i) {
        const e = Math.min(l / h, r / y);
        B = Math.round(h * e), w = Math.round(y * e)
    }
    const f = document.createElement("canvas");
    f.width = Math.max(1, B), f.height = Math.max(1, w);
    const I = f.getContext("2d");
    if ("image/jpeg" === n ? (I.fillStyle = "#fff", I.fillRect(0, 0, f.width, f.height)) : I.clearRect(0, 0, f.width, f.height), I.imageSmoothingEnabled = !0, I.imageSmoothingQuality = "high", I.drawImage(e, 0, 0, f.width, f.height), d) {
        I.save(), I.globalAlpha = .75;
        const e = 15,
            t = Math.max(12, s);
        let n, o, l, r;
        if (I.font = `bold ${t}px sans-serif`, "text" !== a) {
            const i = I.measureText(d).width;
            r = t + 2 * e, l = i + 2 * e;
            const s = 10,
                h = 20;
            if ("bottom-right" === m ? (n = f.width - l, o = f.height - r, I.textAlign = "left", I.textBaseline = "top") : "bottom-left" === m ? (n = 0, o = f.height - r, I.textAlign = "left", I.textBaseline = "top") : "top-right" === m ? (n = f.width - l, o = 0, I.textAlign = "left", I.textBaseline = "top") : "top-left" === m ? (n = 0, o = 0, I.textAlign = "left", I.textBaseline = "top") : "center" === m && (n = (f.width - l) / 2, o = (f.height - r) / 2, I.textAlign = "left", I.textBaseline = "top"), "rectangular" === a) I.fillStyle = hexToRgba(g, .75), I.fillRect(n, o, l, r);
            else if ("rounded" === a) I.fillStyle = hexToRgba(g, .75), I.beginPath(), I.roundRect(n, o, l, r, s), I.fill(), u && (I.strokeStyle = p, I.lineWidth = 2, I.stroke());
            else if ("slanted" === a) I.fillStyle = hexToRgba(g, .75), I.beginPath(), "bottom-right" === m || "top-right" === m ? (I.moveTo(n + h, o), I.lineTo(n + l, o), I.lineTo(n + l - h, o + r), I.lineTo(n, o + r)) : (I.moveTo(n, o), I.lineTo(n + l - h, o), I.lineTo(n + l, o + r), I.lineTo(n + h, o + r)), I.closePath(), I.fill(), u && (I.strokeStyle = p, I.lineWidth = 2, I.stroke());
            else if ("gradient" === a) {
                const e = I.createLinearGradient(n, o, n + l, o + r);
                e.addColorStop(0, hexToRgba(g, .75)), e.addColorStop(1, hexToRgba(c, .75)), I.fillStyle = e, I.fillRect(n, o, l, r)
            }!u || "rectangular" !== a && "gradient" !== a || (I.strokeStyle = p, I.lineWidth = 2, I.strokeRect(n, o, l, r));
            let y = n + e,
                B = o + e + .2 * t;
            "slanted" === a && (y = n + e + h / 2), I.fillStyle = "#fff", I.fillText(d, y, B)
        } else {
            I.fillStyle = "rgba(255,255,255,0.85)", I.strokeStyle = "rgba(0,0,0,0.25)", I.textAlign = "left", I.textBaseline = "bottom";
            const e = d,
                l = I.measureText(e).width,
                r = t;
            n = 10, o = f.height - 10, "bottom-right" === m && (n = f.width - l - 10, o = f.height - 10), "bottom-left" === m && (n = 10, o = f.height - 10), "top-right" === m && (n = f.width - l - 10, o = r + 10), "top-left" === m && (n = 10, o = r + 10), "center" === m && (n = (f.width - l) / 2, o = (f.height + r) / 2), I.lineWidth = Math.max(2, Math.floor(t / 8)), I.strokeText(e, n, o), I.fillStyle = "rgba(0,0,0,0.6)", I.fillText(e, n, o)
        }
        I.restore()
    }
    const b = n;
    return await new Promise(((e, t) => {
        const n = n => {
            n ? e(n) : t(new Error("toBlob returned null"))
        };
        if (f.toBlob) try {
            f.toBlob((e => {
                e || "image/webp" !== b ? n(e) : f.toBlob(n, "image/jpeg", o)
            }), b, o)
        } catch (e) {
            f.toBlob(n, "image/jpeg", o)
        } else try {
            const t = f.toDataURL(b, o).split(","),
                n = t[0].match(/:(.*?);/)[1],
                l = atob(t[1]);
            let r = l.length;
            const i = new Uint8Array(r);
            for (; r--;) i[r] = l.charCodeAt(r);
            e(new Blob([i], {
                type: n
            }))
        } catch (e) {
            t(e)
        }
    }))
}

function hexToRgba(e, t = 1) {
    let n = 0,
        o = 0,
        l = 0;
    return 4 == e.length ? (n = parseInt(e[1] + e[1], 16), o = parseInt(e[2] + e[2], 16), l = parseInt(e[3] + e[3], 16)) : 7 == e.length && (n = parseInt(e.substring(1, 3), 16), o = parseInt(e.substring(3, 5), 16), l = parseInt(e.substring(5, 7), 16)), `rgba(${n}, ${o}, ${l}, ${t})`
}

// ====================================================================
// مقتطف لإضافة خاصية roundRect إذا كانت غير موجودة في المتصفحات القديمة
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radius) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else if (typeof radius === 'object') {
            radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
        } else {
            radius = {tl: 0, tr: 0, br: 0, bl: 0};
        }
        this.beginPath();
        this.moveTo(x + radius.tl, y);
        this.lineTo(x + w - radius.tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
        this.lineTo(x + w, y + h - radius.br);
        this.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
        this.lineTo(x + radius.bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
        this.lineTo(x, y + radius.tl);
        this.quadraticCurveTo(x, y, x + radius.tl, y);
        this.closePath();
        return this;
    };
}
// ====================================================================

// مُعالِجات الأحداث
dropZone.addEventListener("dragover", (e => {
    e.preventDefault(), dropZone.classList.add("dragover")
})), dropZone.addEventListener("dragleave", (e => {
    e.preventDefault(), dropZone.classList.remove("dragover")
})), dropZone.addEventListener("drop", (e => {
    e.preventDefault(), dropZone.classList.remove("dragover");
    const t = e.dataTransfer.files && e.dataTransfer.files[0];
    t && (imgFile.files = e.dataTransfer.files, handleFile(t), PU && PU.tNtf && PU.tNtf("تم تحميل الصورة بنجاح"))
})), imgFile.addEventListener("change", (e => {
    const t = e.target.files && e.target.files[0];
    handleFile(t), t && PU && PU.tNtf && PU.tNtf("تم تحميل الصورة بنجاح")
})), resetBtn.addEventListener("click", (() => {
    originalFile = null, processedBlob = null, previewImg.src = "", previewImg.style.display = "none", emptyPreview.style.display = "block", origSizeEl.innerText = "-", resultSizeEl.innerText = "-", document.getElementById("resultFormat").innerText = "", document.getElementById("infoBox").innerText = "", downloadBtn.disabled = !0, previewOpenBtn.disabled = !0, imgFile.value = "", widthInput.value = "", heightInput.value = "", document.getElementById("wmText").value = "", document.getElementById("quality").value = 85, document.getElementById("qv").innerText = "85", wmTypeSelect.value = "text", textWatermarkControls.style.display = "block", barWatermarkControls.style.display = "none", centerOption.style.display = "block", wmBarGradientColorLabel.style.display = "none", keepAspect.checked = !0, PU && PU.tNtf && PU.tNtf("تم إعادة الضبط")
})), processBtn.addEventListener("click", (async () => {
    if (!originalFile) return void(PU && PU.tNtf && PU.tNtf("من فضلك ارفع صورة أولاً"));
    const e = document.getElementById("outFormat").value || "image/jpeg",
        t = Math.max(.2, Math.min(1, (parseInt(document.getElementById("quality").value) || 85) / 100)),
        n = parseInt(widthInput.value) || null,
        o = parseInt(heightInput.value) || null,
        l = keepAspect.checked,
        r = wmTypeSelect.value,
        i = (document.getElementById("wmText").value || "").trim(),
        a = document.getElementById("wmBarBgColor").value,
        d = document.getElementById("wmBarGradientColor").value,
        m = wmBarBorderEnabled.checked,
        s = document.getElementById("wmBarBorderColor").value,
        g = document.getElementById("wmPos").value || "bottom-right",
        c = parseInt(document.getElementById("wmSize").value) || 20;
    infoBox.innerText = "جاري معالجة الصورة...", processBtn.disabled = !0;
    try {
        const u = await processImage(originalImage, {
            outFormat: e,
            quality: t,
            targetW: n,
            targetH: o,
            keepAspect: l,
            wmType: r,
            wmText: i,
            wmPos: g,
            wmSize: c,
            wmBarBgColor: a,
            wmBarGradientColor: d,
            wmBarBorderEnabled: m,
            wmBarBorderColor: s
        });
        processedBlob = u, resultSizeEl.innerText = formatBytes(u.size), downloadBtn.disabled = !1, previewOpenBtn.disabled = !1, previewOpenBtn.onclick = () => {
            const e = URL.createObjectURL(u);
            window.open(e, "_blank")
        };
        const p = URL.createObjectURL(u);
        previewImg.src = p, previewImg.style.display = "block", emptyPreview.style.display = "none", downloadBtn.onclick = () => {
            downloadBlob(u, `optimized${getExtForMime(e)}`)
        }, document.getElementById("resultFormat").innerHTML = "<strong>الصيغة:</strong> " + e.split("/")[1].toUpperCase();
        const h = originalFile.size,
            y = h - u.size,
            B = (y / h * 100).toFixed(1);
        infoBox.innerHTML = y > 0 ? `تم تحسين الصورة بنجاح!<br>وفرت: ${formatBytes(y)} (${B}%)` : "تم معالجة الصورة بنجاح", PU && PU.tNtf && PU.tNtf("تم تحسين الصورة بنجاح")
    } catch (e) {
        console.error(e), PU && PU.tNtf && PU.tNtf("حدث خطأ أثناء معالجة الصورة"), infoBox.innerText = "حدث خطأ أثناء المعالجة"
    } finally {
        processBtn.disabled = !1
    }
})), widthInput.addEventListener("input", (function () {
    if (keepAspect.checked && originalImage.width && originalImage.height) {
        const e = originalImage.height / originalImage.width;
        heightInput.value = Math.round(this.value * e)
    }
})), heightInput.addEventListener("input", (function () {
    if (keepAspect.checked && originalImage.width && originalImage.height) {
        const e = originalImage.width / originalImage.height;
        widthInput.value = Math.round(this.value * e)
    }
})), wmTypeSelect.addEventListener("change", (e => {
    const t = e.target.value;
    textWatermarkControls.style.display = "none", barWatermarkControls.style.display = "none", wmBarGradientColorLabel.style.display = "none", wmBarBorderColorLabel.style.display = "none", "text" === t ? (textWatermarkControls.style.display = "block", centerOption.style.display = "block") : (barWatermarkControls.style.display = "block", centerOption.style.display = "block", "gradient" === t && (wmBarGradientColorLabel.style.display = "block"), wmBarBorderEnabled.checked && (wmBarBorderColorLabel.style.display = "block"))
})), wmBarBorderEnabled.addEventListener("change", (e => {
    wmBarBorderColorLabel.style.display = e.target.checked ? "block" : "none"
})), downloadBtn.disabled = !0, previewOpenBtn.disabled = !0, wmTypeSelect.dispatchEvent(new Event("change")); // يتم تشغيل هذا لتطبيق إعدادات العلامة المائية الافتراضية عند التحميل

