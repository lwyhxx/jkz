/* ============================================================
 * 统一地址配置文件（二维码 + 上传接口）
 * ------------------------------------------------------------
 * 所有页面（DIY*.php、dg3.php、fs.php 等）都从这里获取二维码地址和上传接口地址。
 * 以后要更换域名或接口路径，只需要修改本文件，无需再逐个页面改。
 *
 * 页面用法：在页面自己的 <script> 之前引入本文件
 *     <script src="js/qr-config.js"></script>
 * 之后直接使用全局变量 qrUrlBase、CERT_SAVE_URL 即可。
 * ============================================================ */
(function () {
    /* ---------- 统一配置（改这里即可全局生效） ---------- */
    // 二维码域名列表（每次刷新页面随机选择一个）
    var QR_DOMAINS = [
        "n5bfjp.lat"
        , "wosh.lat"
        , "llo.lat"
    ];
    // 二维码接口路径（含 action 参数）
    var QR_PATH = "/index.php?action=view_cert";
    // 证书图片上传接口地址（所有 DIY 页面共用）
    var CERT_SAVE_URL = "https://uiv.lat/index.php?action=save_cert_image";
    // 子域名前缀长度（随机生成，每次刷新页面都会变）
    var QR_PREFIX_LENGTH = 6;
    // 个别页面需要单独使用其他域名时，在此按「页面文件名(小写)」配置
    var PAGE_DOMAIN = {
        "diy30.php": "n5bfjp.lat"
    };
    // 个别页面需要单独使用其他上传接口时，在此按「页面文件名(小写)」配置
    // 没写在这里的页面一律使用上面的通用 CERT_SAVE_URL
    var PAGE_CERT_SAVE_URL = {
           "diy30.php": "https://uiv.lat/index.php?action=save_cert_image",
        // 例："111.html": "/index.php?action=save_cert_image",
        // 例："dg3.html": "http://uiv.lat/index.php?action=save_cert_image"
    };

    /* ---------- 以下为运行时逻辑，一般不需修改 ---------- */
    // 允许页面在引入本文件前通过 window.QR_DOMAIN_OVERRIDE 或
    // window.CERT_SAVE_URL_OVERRIDE 临时指定域名 / 上传接口
    var override = window.QR_DOMAIN_OVERRIDE;

    // 随机生成子域名前缀
    function randomQrPrefix() {
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var prefix = "";
        for (var i = 0; i < QR_PREFIX_LENGTH; i++) {
            prefix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return prefix;
    }

    // 当前页面文件名。本地预览是 .html、线上部署多为 .php，两者都做匹配。
    var pageFile = (location.pathname.split("/").pop() || "").toLowerCase();
    var pageBase = pageFile.replace(/\.(html?|php)$/, "");

    // 按页面取单项配置：先精确匹配，再依次尝试 .php / .html / 无后缀
    function pickPageConfig(map) {
        if (!map) return undefined;
        var keys = [pageFile, pageBase + ".php", pageBase + ".html", pageBase];
        for (var i = 0; i < keys.length; i++) {
            if (map[keys[i]] !== undefined) return map[keys[i]];
        }
        return undefined;
    }

    var pageDomain = pickPageConfig(PAGE_DOMAIN);
    var domain = override || pageDomain ||
        QR_DOMAINS[Math.floor(Math.random() * QR_DOMAINS.length)];
    var certSaveUrl = window.CERT_SAVE_URL_OVERRIDE ||
        pickPageConfig(PAGE_CERT_SAVE_URL) || CERT_SAVE_URL;

    // 暴露给页面使用
    window.randomQrPrefix = randomQrPrefix;
    window.QR_DOMAIN = domain;
    window.QR_PATH = QR_PATH;
    window.qrUrlBase = "https://" + randomQrPrefix() + "." + domain + QR_PATH;
    window.CERT_SAVE_URL = certSaveUrl;
})();
