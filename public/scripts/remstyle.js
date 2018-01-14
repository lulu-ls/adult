(function (doc, win) {

    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            clientWidth = (clientWidth > 768 ) ? 768 : clientWidth ; docEl.style.fontSize = 10 * (clientWidth / 375 ) + 'px';
        };
    if (!doc.addEventListener) return; win.addEventListener(resizeEvt, recalc, false);
    recalc();
})(document, window);