/* ============================================
   i18n — Language Switching (CN ↔ EN)
   Uses data-i18n attributes on DOM elements.
   ============================================ */

(function initI18n() {
    const translations = {
        // — Nav —
        'nav.site_title':       { zh: "Giaory 的个人站点", en: "Giaory's Personal Site" },
        'nav.home':             { zh: "首页", en: "Home" },
        'nav.github':           { zh: "GitHub", en: "GitHub" },
        'nav.social':           { zh: "社交", en: "Social" },
        'nav.tech':             { zh: "技术栈", en: "Tech" },

        // — Hero / About Me —
        'hero.titlebar':        { zh: "About Me - Giaory", en: "About Me - Giaory" },
        'hero.bio':             { zh: "一个热爱技术与创作的探索者。日常穿梭于代码与内容之间，专注于开源项目开发、效率工具构建和跨平台内容创作。相信技术可以改变生活，也乐于分享一路上的发现与思考。",
                                  en: "A passionate explorer bridging code and creativity. I focus on open-source development, productivity tools, and cross-platform content creation. I believe technology can change lives, and I love sharing discoveries along the way." },

        // — GitHub Stats —
        'stats.titlebar':       { zh: "GitHub Stats", en: "GitHub Stats" },

        // — Music Player Card —
        'music.titlebar':       { zh: "Music Player", en: "Music Player" },
        'music.now_playing':    { zh: "NOW PLAYING", en: "NOW PLAYING" },
        'music.click_play':     { zh: "点击播放", en: "Click to play" },
        'music.source_label':   { zh: "📡 音源：", en: "📡 Source:" },
        'music.source_netease': { zh: "网易云音乐", en: "NetEase Music" },
        'music.source_bilibili':{ zh: "B站音乐", en: "Bilibili Music" },
        'music.open_float':     { zh: "🎧 打开悬浮窗播放器", en: "🎧 Open Floating Player" },

        // — Heatmap —
        'heatmap.titlebar':     { zh: "GitHub Contributions", en: "GitHub Contributions" },
        'heatmap.note':         { zh: "⚠ 注意：私有仓库的贡献不会在此图表中显示", en: "⚠ Note: Contributions from private repos are not shown" },

        // — Xiaohongshu —
        'xhs.titlebar':        { zh: "小红书 - Xiaohongshu", en: "Xiaohongshu (RED)" },
        'xhs.heading':         { zh: "小红书", en: "Xiaohongshu" },
        'xhs.visit':           { zh: "访问主页 →", en: "Visit Profile →" },
        'xhs.empty':           { zh: "📝 暂无笔记，敬请期待首次内容更新！", en: "📝 No posts yet — stay tuned for the first update!" },

        // — WeChat —
        'wechat.titlebar':     { zh: "微信公众号", en: "WeChat Official Account" },
        'wechat.label':        { zh: "公众号名称", en: "Account Name" },
        'wechat.desc':         { zh: "微信搜索关注，获取更多精彩内容 ✨", en: "Search on WeChat to follow for more content ✨" },

        // — Bilibili —
        'bili.titlebar':       { zh: "Bilibili", en: "Bilibili" },
        'bili.coming':         { zh: "即将入驻", en: "Coming Soon" },
        'bili.coming_text':    { zh: "敬请期待 Giaory 的视频内容 🎬", en: "Stay tuned for Giaory's video content 🎬" },

        // — Tech Stack —
        'tech.titlebar':       { zh: "Tech Stack & Exploration", en: "Tech Stack & Exploration" },
        'tech.opensource':     { zh: "开源贡献", en: "Open Source" },

        // — Projects —
        'projects.titlebar':   { zh: "Recent Projects", en: "Recent Projects" },
        'projects.heading':    { zh: "近期项目", en: "Recent Projects" },
        'projects.viewall':    { zh: "查看全部 →", en: "View All →" },
        'projects.loading':    { zh: "加载中...", en: "Loading..." },

        // — Footer —
        'footer.built':        { zh: 'Built with ❤️ by <strong>Giaory</strong> &copy; 2026', en: 'Built with ❤️ by <strong>Giaory</strong> &copy; 2026' },
        'footer.sub':          { zh: "Powered by curiosity and late-night debugging ☕", en: "Powered by curiosity and late-night debugging ☕" },

        // — Floating Player —
        'player.titlebar':     { zh: "🎵 Music Player", en: "🎵 Music Player" },
        'player.search_ph':    { zh: "搜索歌曲...", en: "Search songs..." },
        'player.search_btn':   { zh: "搜索", en: "Search" },
        'player.no_play':      { zh: "未在播放", en: "Not Playing" },

        // — Toast —
        'toast.copied':        { zh: "已复制到剪贴板！", en: "Copied to clipboard!" },
    };

    let currentLang = localStorage.getItem('site-lang') || 'zh';

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('site-lang', lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const t = translations[key];
            if (!t) return;

            const text = t[lang] || t['zh'];

            // Check what attribute to set
            const attr = el.getAttribute('data-i18n-attr');
            if (attr === 'placeholder') {
                el.placeholder = text;
            } else if (attr === 'title') {
                el.title = text;
            } else if (attr === 'html') {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });

        // Update toggle button text
        const btn = document.getElementById('lang-toggle-btn');
        if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
    }

    // Toggle
    window.toggleLanguage = function () {
        applyLanguage(currentLang === 'zh' ? 'en' : 'zh');
    };

    // Init on DOM ready
    applyLanguage(currentLang);
})();
