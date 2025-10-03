/* auth-system/login-min.js */

(function() {
    // 1. تعريف الهيكل الكامل (يشمل HTML و CSS و Script Tags)
    const loginContent = `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/auth-system/login.css" />
        <div class="login-fullpage">
            <div class="login-container w-full">
                <div class="mx-auto w-full max-w-md space-y-5 text-center">
                    <div class="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 -mt-4 mb-2">
                        <svg viewBox="0 0 514 514" class="logo-icon">
                            <path class="part1" fill="rgba(225,20,98,0.9)" d="M195 167.9c-3.4 1.7-8 7.3-28 33.2l-8.8 11.5 14 18.2 14 18.2 3.8-3.4c6.6-6 14.2-7 21.3-2.8 2.5 1.5 19 22.2 68 85.9 6.5 8.4 13 16 14.5 17.1 6.5 4.5 15.5 5.5 20.2 2.2 2.7-1.9 43-53 43-54.5a301 301 0 0 0-24.2-30.3c-.5.2-5.5 6.4-11.1 13.7-9.5 12.4-13 16.2-14 15L273 247c-58.8-76.2-59.3-76.8-63.1-79a15.7 15.7 0 0 0-15-.1"/>
                            <path class="part2" fill="rgba(111,202,220,0.9)" d="M104 180.4c-2 1.3-4.8 4.6-6.3 7.4-5.7 10.6-4.6 20.3 3.7 31C182 322.5 204.4 351 206.1 352c7 3.7 12.7 2.8 18-2.8a948 948 0 0 0 29.2-37c.6-.8-3-6-11.3-16.8L230 280l-4.5 3.2c-8.6 6.1-19.4 4.8-27-3.4-1.7-1.8-19.4-24.3-39.3-50a1327.4 1327.4 0 0 0-39.2-49.2c-4.1-3.5-11-3.6-16-.2"/>
                            <path class="part3" fill="rgba(61,184,143,0.9)" d="M312 173.6c-2 1.2-35.7 43.5-42.7 53.4-1 1.5.4 3.8 10.3 16.6l12.4 15.7a87 87 0 0 0 13-15c6.7-8.7 12.8-15.8 13.5-15.8 1.3 0 39 47.6 44.2 56a950 950 0 0 0 35.7 45.4c3 2.4 10.8 2.6 15.2.3 10-5.1 16.2-17.1 13.4-25.6-.6-1.9-9.5-14.3-19.8-27.5L362.5 220a1046 1046 0 0 1-29-38.4c-4.1-6.6-8.5-9.5-14.4-9.5-2.5 0-5.7.8-7.1 1.6"/>
                            <path class="part4" fill="rgba(233,169,32,0.9)" d="M106.8 282.6c-24.2 31.2-24.8 32-26.3 36.4a26.2 26.2 0 0 0 4.1 24.5c4.7 6.2 12 8.2 18.3 5a830 830 0 0 0 43.3-54c.6-1.1-21.2-30.7-23.2-31.4a191 191 0 0 0-16.2 19.5m298.8-118c-3 .8-8.8 4.8-12.2 8.4a446.8 446.8 0 0 0-26.1 38c-.3 1.1 4 7.6 11.4 17.3 11 14.7 11.9 15.5 13.3 13.7l14-20a4025 4025 0 0 1 16.2-23.3c8.5-12 7-28.6-2.9-33.3a26 26 0 0 0-13.7-.8"/>
                        </svg>
                        Modweeb Design
                    </div>
                    <div class="card mx-auto">
                        <div class="space-y-0.2 text-center p-4 pb-0">
                            <b class="text-lg font-bold text-neutral-900 mb-1">مرحباً بعودتك</b>
                            <p class="text-neutral-500 text-xs">تسجيل الدخول باستخدام حسابك الاجتماعي</p>
                        </div>
                        <div class="p-4 pt-2">
                            <div class="grid gap-4">
                                <button id="custom-google-btn" class="button button-outline w-full" style="border-radius:15px">
                                    <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                    تسجيل الدخول باستخدام Google
                                </button>
                                <div class="flex gap-2">
                                    <a href="https://t.me/modweeb" target="_blank" rel="noopener noreferrer" class="button button-black flex-1 btn-small"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 h-4 w-4 lucide lucide-send"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>تيليجرام</a>
                                    <a href="https://www.blogger.com/followers/follow/2986788159829882847" target="_blank" rel="noopener noreferrer" class="button button-black flex-1 btn-small"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 h-4 w-4 lucide lucide-rss"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>تابع المدونة</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="px-6 text-center text-xs text-neutral-500 mt-2">
                        بالنقر على متابعة، فإنك توافق على
                        <a href="/p/terms.html" class="link">شروط الخدمة</a>
                        و
                        <a href="/p/privacy-policy.html" class="link">سياسة الخصوصية</a>.
                    </p>
                </div>
            </div>
            <div id="toastMessage" class="toast"></div>
        </div>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script src="https://cdn.jsdelivr.net/gh/modweeb-widget/modweeb-tools@main/auth-system/login.js"></script>
    `;

    // 2. إدراج المحتوى في نهاية جسم الصفحة
    document.body.insertAdjacentHTML('beforeend', loginContent);
})();
