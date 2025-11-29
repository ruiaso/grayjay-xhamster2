// XHamsterScript.js

global.source = {
    name: "xHamster",
    id: "xhamster-plugin",
    cookies: "",

    enable: function (info, bridge) {
        console.log("XHamster plugin enabled");
    },

    http: {
        defaultHeaders: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        async fetch(url, options = {}) {
            options.headers = Object.assign({}, this.defaultHeaders, options.headers || {});
            if (global.source.cookies) {
                options.headers["Cookie"] = global.source.cookies;
            }
            const res = await fetch(url, options);
            return res;
        }
    },

    login: async function (username, password) {
        // Placeholder login logic — real login may need CSRF token handling
        const loginUrl = "https://xhamster.com/login";
        const res = await this.http.fetch(loginUrl, {
            method: "POST",
            body: new URLSearchParams({ username, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        // Store cookies (replace with real cookie parsing)
        this.cookies = res.headers.get("set-cookie") || "";
        console.log("Login successful");
        return true;
    },

    getHome: async function () {
        const url = "https://xhamster.com/videos";
        const res = await this.http.fetch(url);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const results = [];
        doc.querySelectorAll(".thumb a").forEach(a => {
            const title = a.querySelector("img")?.alt || "No title";
            const href = a.href;
            const thumbnail = a.querySelector("img")?.src || "";
            results.push({ title, url: href, thumbnail });
        });

        return { results, nextPage: null };
    },

    search: async function (query) {
        const url = `https://xhamster.com/search?q=${encodeURIComponent(query)}`;
        const res = await this.http.fetch(url);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const results = [];
        doc.querySelectorAll(".thumb a").forEach(a => {
            const title = a.querySelector("img")?.alt || "No title";
            const href = a.href;
            const thumbnail = a.querySelector("img")?.src || "";
            results.push({ title, url: href, thumbnail });
        });

        return { results, nextPage: null };
    },

    getPlaylistContents: async function (playlistUrl) {
        const res = await this.http.fetch(playlistUrl);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const results = [];
        doc.querySelectorAll(".thumb a").forEach(a => {
            const title = a.querySelector("img")?.alt || "No title";
            const href = a.href;
            const thumbnail = a.querySelector("img")?.src || "";
            results.push({ title, url: href, thumbnail });
        });

        return { results };
    }
};

export {};
