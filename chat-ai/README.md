# Modweeb Chat Widget

هذا المشروع هو عبارة عن أداة دردشة ذكاء اصطناعي قابلة للتخصيص بالكامل، مصممة خصيصاً للتضمين في مدونات ومواقع الويب. تعتمد الأداة على نموذج `Gemma AI` من Google وتستضيفها Hugging Face، مما يوفر تجربة محادثة سلسة وفعالة لزوار موقعك.

---

### الميزات الرئيسية

* **تكامل سهل**: يمكن تضمينها في أي موقع ويب أو مدونة (مثل بلوجر) عن طريق نسخ ولصق بضعة أسطر من الكود.
* **نموذج AI قوي**: تستخدم أحدث نماذج Gemma AI لتقديم ردود ذكية ودقيقة.
* **واجهة مستخدم جذابة**: تصميم عصري وبسيط يتناسب مع معظم المواقع.
* **قابلية التخصيص**: يمكن تعديل الواجهة الأمامية بالكامل (CSS) لتتناسب مع هوية موقعك.
* **وضع المطور**: ميزة سرية (خمس نقرات على رأس الدردشة) لإزالة الحدود اليومية للرسائل أثناء التطوير.

---

### كيفية التثبيت والاستخدام

#### 1. الحصول على مفتاح Hugging Face API

* قم بزيارة [Hugging Face](https://huggingface.co/settings/tokens).
* أنشئ مفتاح API جديداً بنوع `Read`.
* انسخ المفتاح.

#### 2. إعداد GitHub Pages

* قم بإنشاء مستودع GitHub جديد.
* ارفع ملفات `modweeb-chat.js`، `modweeb-chat.css`، و **`encrypt-tool.html`** إلى المستودع.
* اذهب إلى `Settings` > `Pages` واختر الفرع الرئيسي (`main`) كمصدر للنشر.

#### 3. تشفير المفتاح

* افتح ملف **`encrypt-tool.html`** مباشرة من مستودعك على GitHub Pages.
    * مثال: `https://yourusername.github.io/your-repo-name/encrypt-tool.html`
* الصق مفتاح API الأصلي في الأداة، ثم اضغط على "تشفير".
* انسخ المفتاح المشفر.

#### 4. تضمين الكود في موقعك

* انسخ الكود التالي.
* الصقه في قالب موقعك (يفضل قبل وسم `</body>` لضمان سرعة التحميل).
* **استبدل `'ضع_المفتاح_المشفر_هنا'` بالمفتاح المشفر الذي حصلت عليه في الخطوة السابقة.**

```html
<link rel="stylesheet" href="[https://cdn.jsdelivr.net/gh/YourUsername/YourRepo/modweeb-chat.css](https://cdn.jsdelivr.net/gh/YourUsername/YourRepo/modweeb-chat.css)" />
<div id="modweeb-widget-container">
  <div id="modweeb-chat-container">
    </div>
</div>
<script src="[https://cdn.jsdelivr.net/gh/YourUsername/YourRepo/modweeb-chat.js](https://cdn.jsdelivr.net/gh/YourUsername/YourRepo/modweeb-chat.js)"></script>
<script>
    modweebChat({
        config: {
            hfToken: 'ضع_المفتاح_المشفر_هنا',
            hfModel: 'google/gemma-2-9b-it:nebius'
        },
    });
</script>
