/* ============================================================
 * 二维码地址统一配置文件
 * ------------------------------------------------------------
 * 所有页面（DIY*.php、dg3.php、fs.php 等）都从这里获取二维码地址。
 * 以后要更换域名或接口路径，只需要修改本文件，无需再逐个页面改。
 *
 * 页面用法：在页面自己的 <script> 之前引入本文件
 *     <script src="js/qr-config.js"></script>
 * 之后直接使用全局变量 qrUrlBase 即可。
 * ============================================================ */
(function () {
    /* ---------- 统一配置（改这里即可全局生效） ---------- */
    // 二维码域名（默认域名，所有页面共用）
    var QR_DOMAIN = "n5bfjp.lat";
    // 二维码接口路径（含 action 参数）
    var QR_PATH = "/index.php?action=view_cert";
    // 子域名前缀长度（随机生成，每次刷新页面都会变）
    var QR_PREFIX_LENGTH = 6;
    // 个别页面需要单独使用其他域名时，在此按「页面文件名(小写)」配置
    var PAGE_DOMAIN = {
        "diy30.php": "n5bfjp.lat"
    };

    /* ---------- 以下为运行时逻辑，一般不需修改 ---------- */
    // 允许页面在引入本文件前通过 window.QR_DOMAIN_OVERRIDE 临时指定域名
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

    // 根据当前页面文件名匹配单独域名配置
    var pageName = (location.pathname.split("/").pop() || "").toLowerCase();
    var domain = override || PAGE_DOMAIN[pageName] || QR_DOMAIN;

    // 暴露给页面使用
    window.randomQrPrefix = randomQrPrefix;
    window.QR_DOMAIN = domain;
    window.QR_PATH = QR_PATH;
    window.qrUrlBase = "https://" + randomQrPrefix() + "." + domain + QR_PATH;
})();
