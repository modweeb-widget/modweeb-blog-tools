/* auth-system/account-min.js */

(function() {
    // 1. تعريف الهيكل الكامل (يشمل HTML و CSS و Script Tags)
    const accountContent = `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/auth-system/account.css" />
        <div class="login-fullpage">
            <div class="mx-auto w-full max-w-md space-y-5 text-center">
                <div class="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 -mt-4 mb-1">
                    <svg viewBox="0 0 514 514" class="logo-icon">
                        <path class="part1" fill="rgba(225,20,98,0.9)" d="M195 167.9c-3.4 1.7-8 7.3-28 33.2l-8.8 11.5 14 18.2 14 18.2 3.8-3.4c6.6-6 14.2-7 21.3-2.8 2.5 1.5 19 22.2 68 85.9 6.5 8.4 13 16 14.5 17.1 6.5 4.5 15.5 5.5 20.2 2.2 2.7-1.9 43-53 43-54.5a301 301 0 0 0-24.2-30.3c-.5.2-5.5 6.4-11.1 13.7-9.5 12.4-13 16.2-14 15L273 247c-58.8-76.2-59.3-76.8-63.1-79a15.7 15.7 0 0 0-15-.1"/>
                        <path class="part2" fill="rgba(111,202,220,0.9)" d="M104 180.4c-2 1.3-4.8 4.6-6.3 7.4-5.7 10.6-4.6 20.3 3.7 31C182 322.5 204.4 351 206.1 352c7 3.7 12.7 2.8 18-2.8a948 948 0 0 0 29.2-37c.6-.8-3-6-11.3-16.8L230 280l-4.5 3.2c-8.6 6.1-19.4 4.8-27-3.4-1.7-1.8-19.4-24.3-39.3-50a1327.4 1327.4 0 0 0-39.2-49.2c-4.1-3.5-11-3.6-16-.2"/>
                        <path class="part3" fill="rgba(61,184,143,0.9)" d="M312 173.6c-2 1.2-35.7 43.5-42.7 53.4-1 1.5.4 3.8 10.3 16.6l12.4 15.7a87 87 0 0 0 13-15c6.7-8.7 12.8-15.8 13.5-15.8 1.3 0 39 47.6 44.2 56a950 950 0 0 0 35.7 45.4c3 2.4 10.8 2.6 15.2.3 10-5.1 16.2-17.1 13.4-25.6-.6-1.9-9.5-14.3-19.8-27.5L362.5 220a1046 1046 0 0 1-29-38.4c-4.1-6.6-8.5-9.5-14.4-9.5-2.5 0-5.7.8-7.1 1.6"/>
                        <path class="part4" fill="rgba(233,169,32,0.9)" d="M106.8 282.6c-24.2 31.2-24.8 32-26.3 36.4a26.2 26.2 0 0 0 4.1 24.5c4.7 6.2 12 8.2 18.3 5a830 830 0 0 0 43.3-54c.6-1.1-21.2-30.7-23.2-31.4a191 191 0 0 0-16.2 19.5m298.8-118c-3 .8-8.8 4.8-12.2 8.4a446.8 446.8 0 0 0-26.1 38c-.3 1.1 4 7.6 11.4 17.3 11 14.7 11.9 15.5 13.3 13.7l14-20a4025 4025 0 0 1 16.2-23.3c8.5-12 7-28.6-2.9-33.3a26 26 0 0 0-13.7-.8"/>
                    </svg>
                    Modweeb Design
                </div>
                <div class="card w-full max-w-sm mx-auto">
                    <div class="card-content" id="accountInfo"></div>
                    <div class="px-4 py-3 flex gap-2 justify-between items-center border-t border-gray-200" id="accountButtons">
                        <a href="/" class="button button-outline flex-1">
                            <svg class="line" viewBox="0 0 24 24"><path d="M12 18V15"></path><path d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z"></path></svg>
                            الرئيسية
                        </a>
                        <button id="logoutBtn" class="button button-black flex-1">
                            <svg class="line" viewBox="0 0 24 24"><path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"></path><path d="M15 12H3.62"></path><path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"></path></svg>
                            خروج
                        </button>
                    </div>
                </div>
                <div id="logoutModal" class="modal-bg" style="display:none">
                    <div class="modal-content text-center">
                        <b class="font-bold mb-2 text-base">تأكيد تسجيل الخروج</b>
                        <p class="text-neutral-600 mb-4 text-sm">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
                        <div class="flex gap-2 justify-center">
                            <a href="/" class="button button-outline flex-1">
                                <svg class="line" viewBox="0 0 24 24"><path d="M12 18V15"></path><path d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z"></path></svg>
                                الرئيسية
                            </a>
                            <button id="cancelLogout" class="button button-outline flex-1">إلغاء</button>
                            <button id="confirmLogout" class="button button-black flex-1">تأكيد</button>
                        </div>
                    </div>
                </div>
                <div id="toastMessage" class="toast"></div>
            </div>
        </div>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script src="https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/auth-system/account.js"></script>
    `;

    // 2. إدراج المحتوى في نهاية جسم الصفحة
    document.body.insertAdjacentHTML('beforeend', accountContent);
})();
