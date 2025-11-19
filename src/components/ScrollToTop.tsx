import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopSmart() {
    const location = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);

        document.querySelectorAll('*').forEach((el: any) => {
            if (el.classList?.contains('no-scroll-reset')) return;

            const style = window.getComputedStyle(el);
            const canScroll = /(auto|scroll)/.test(style.overflowY);

            if (canScroll && el.scrollHeight > el.clientHeight) {
                el.scrollTop = 0;
            }
        });
    }, [location.pathname]);

    return null;
}
