function notify(e) {
    if (window.opener && window.opener.PU && "function" == typeof window.opener.PU.tNtf) {
        window.opener.PU.tNtf(e);
    } else {
        const o = document.getElementById("toastMessage");
        if (o) {
            o.innerText = e;
            o.classList.add("active");
            setTimeout((() => {
                o.classList.remove("active");
            }), 3e3);
        }
    }
}

async function getUserInfo(e) {
    try {
        notify("جارٍ تسجيل الدخول، يرجى الانتظار...");
        const o = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: "Bearer " + e
            }
        });
        if (!o.ok) {
            throw new Error("Failed to fetch user info");
        }
        const t = await o.json(),
            n = {
                type: "loginSuccess",
                user: {
                    name: t.name,
                    email: t.email,
                    image: t.picture
                }
            };
        if (window.opener) {
            const e = window.location.origin.includes("blogspot") ? "https://mdwnplus.blogspot.com" : window.location.origin;
            window.opener.postMessage(n, e);
            notify("تم تسجيل الدخول بنجاح!");
            setTimeout((() => window.close()), 1e3);
        } else {
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userName", t.name);
            localStorage.setItem("userEmail", t.email);
            localStorage.setItem("userPicture", t.picture);
            localStorage.getItem("userJoinDate") || localStorage.setItem("userJoinDate", (new Date).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }));
            const e = new URLSearchParams(window.location.search).get("cbu") || "/";
            notify("تم تسجيل الدخول بنجاح!");
            setTimeout((() => window.location.href = e), 1e3);
        }
    } catch (e) {
        console.error("Error fetching user info:", e);
        notify("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    }
}

let client;

window.onload = function() {
    if ("undefined" != typeof google && void 0 !== google.accounts) {
        client = google.accounts.oauth2.initTokenClient({
            client_id: "36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com",
            scope: "openid profile email",
            callback: e => {
                e && e.access_token ? getUserInfo(e.access_token) : notify("لم يتم العثور على رمز الوصول. يرجى المحاولة مرة أخرى.");
            }
        });
        document.getElementById("custom-google-btn").addEventListener("click", (function() {
            client.requestAccessToken();
        }));
    } else {
        notify("فشل تحميل مكتبة جوجل للمصادقة. يرجى التحقق من اتصالك بالإنترنت.");
    }
}
