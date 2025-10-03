function notify(t) {
    if (window.PU && "function" == typeof PU.tNtf) {
        PU.tNtf(t);
    } else {
        const e = document.getElementById("toastMessage");
        if (e) {
            e.innerText = t;
            e.classList.add("active");
            setTimeout((() => {
                e.classList.remove("active");
            }), 3e3);
        }
    }
}

function getUserData() {
    return {
        isLoggedIn: "true" === localStorage.getItem("userLoggedIn"),
        name: localStorage.getItem("userName"),
        picture: localStorage.getItem("userPicture"),
        email: localStorage.getItem("userEmail"),
        joinDate: localStorage.getItem("userJoinDate")
    }
}

function clearUserData() {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPicture");
    localStorage.removeItem("userJoinDate");
}

function updateAccountInfo() {
    const t = document.getElementById("accountInfo"),
        e = document.getElementById("accountButtons");
    if (!t || !e) return;
    const {
        isLoggedIn: n,
        name: o,
        picture: a,
        joinDate: l
    } = getUserData();
    if (n && o) {
        t.innerHTML = `
                <h2 class="text-sm font-bold text-neutral-600 text-right mb-4">إدارة الحساب</h2>
                <div class="profile-row">
                    <img id="avatarImg" src="${a||"https://ui-avatars.com/api/?name="+encodeURIComponent(o)+"&background=0D8ABC&color=fff"}" alt="${o}" class="avatar-preview" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(o)}&background=0D8ABC&color=fff';">
                    <div class="profile-names">
                        <span class="text-xs text-neutral-500">اسم المستخدم</span>
                        <span class="profile-name" id="profileName">${o}</span>
                        <span class="text-xs text-neutral-500 mt-2">انضم منذ</span>
                        <span class="profile-date">${l||"غير محدد"}</span>
                    </div>
                    <div class="flex flex-col items-center mr-auto">
                        <span class="text-xs text-neutral-500 mb-1">الإعدادات</span>
                        <button class="settings-btn" id="showSettingsBtn" title="الإعدادات">
                          <svg class='line' viewBox='0 0 24 24' width="22" height="22">
                            <path d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'></path>
                            <path d='M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z' stroke-miterlimit='10'></path>
                            <path d='M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47' stroke-miterlimit='10'></path>
                            <path d='M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43'></path>
                          </svg>
                          </button>
                    </div>
                </div>
                <div class="settings-panel" id="settingsPanel">
                    <form id="editProfileForm">
                        <label class="text-xs">الاسم:
                            <input type="text" id="editName" class="input" value="${o}" maxlength="32" required>
                        </label>
                        <div class="text-xs text-neutral-600 mb-1 mt-2">تغيير الصورة:</div>
                        <label class="text-xs text-neutral-500 block mb-1">
                          (إما برفع صورة من جهازك)
                          <input type="file" id="editPic" accept="image/*" class="input" style="padding:0;">
                        </label>
                        <label class="text-xs text-neutral-500 block">
                          (أو بإضافة رابط مباشر للصورة)
                          <input type="url" id="editPicUrl" class="input" placeholder="https://example.com/avatar.jpg">
                        </label>
                        <button type="submit" class="button button-black w-full mt-2">حفظ التعديلات</button>
                    </form>
                </div>
            `;
        setupEditProfileListeners();
        e.style.display = "flex";
    } else {
        t.innerHTML = `
                <p class="text-neutral-500 text-sm">لم يتم تسجيل الدخول.</p>
                <a href="/p/login.html?cbu=/p/account.html" class="button button-black mt-4">تسجيل الدخول</a>
            `;
        e.style.display = "none";
    }
}

function setupEditProfileListeners() {
    const t = document.getElementById("showSettingsBtn"),
        e = document.getElementById("settingsPanel"),
        n = document.getElementById("editProfileForm"),
        o = document.getElementById("editPic"),
        a = document.getElementById("editPicUrl");
    if (t) {
        t.onclick = function() {
            e.classList.toggle("active");
        };
    }
    document.addEventListener("click", (n => {
        if (e && t && !e.contains(n.target) && !t.contains(n.target)) {
            e.classList.remove("active");
        }
    }));
    if (o) {
        o.addEventListener("change", (t => {
            const e = t.target.files[0];
            if (e) {
                const t = new FileReader;
                t.onload = function(t) {
                    document.getElementById("avatarImg").src = t.target.result;
                    if (a) {
                        a.value = "";
                    }
                };
                t.readAsDataURL(e);
            }
        }));
    }
    if (a) {
        a.addEventListener("input", (t => {
            document.getElementById("avatarImg").src = t.target.value;
            if (o) {
                o.value = "";
            }
        }));
    }
    if (n) {
        n.addEventListener("submit", (t => {
            t.preventDefault();
            const n = document.getElementById("editName").value.trim();
            let l = a ? a.value.trim() : "";
            const s = o ? o.files[0] : null;
            if (s) {
                const t = new FileReader;
                t.onload = function(t) {
                    localStorage.setItem("userPicture", t.target.result);
                    localStorage.setItem("userName", n);
                    updateAccountInfo();
                    notify("تم حفظ التعديلات بنجاح!");
                    if (e) {
                        e.classList.remove("active");
                    }
                };
                t.readAsDataURL(s);
            } else {
                if (l) {
                    localStorage.setItem("userPicture", l);
                }
                localStorage.setItem("userName", n);
                updateAccountInfo();
                notify("تم حفظ التعديلات بنجاح!");
                if (e) {
                    e.classList.remove("active");
                }
            }
        }));
    }
}

function handleLogout() {
    notify("جارٍ تسجيل الخروج، يرجى الانتظار...");
    if ("undefined" != typeof google && void 0 !== google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
    clearUserData();
    setTimeout((() => {
        notify("تم تسجيل الخروج بنجاح!");
        window.location.href = "/p/login.html";
    }), 1e3);
}

function showLogoutModal() {
    const t = document.getElementById("logoutModal");
    if (t) {
        t.style.display = "flex";
    }
}

function hideLogoutModal() {
    const t = document.getElementById("logoutModal");
    if (t) {
        t.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", (() => {
    updateAccountInfo();
    const t = document.getElementById("logoutBtn"),
        e = document.getElementById("cancelLogout"),
        n = document.getElementById("confirmLogout");
    if (t) {
        t.onclick = showLogoutModal;
    }
    if (e) {
        e.onclick = hideLogoutModal;
    }
    if (n) {
        n.onclick = handleLogout;
    }
}));

window.addEventListener("storage", updateAccountInfo);
