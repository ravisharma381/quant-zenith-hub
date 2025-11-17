import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopSmart() {
    const location = useLocation();

    useLayoutEffect(() => {
        // scroll window
        window.scrollTo(0, 0);

        // scroll ALL scrollable elements
        document.querySelectorAll('*').forEach((el: any) => {
            const style = window.getComputedStyle(el);
            const canScroll = /(auto|scroll)/.test(style.overflowY);

            if (canScroll && el.scrollHeight > el.clientHeight) {
                el.scrollTop = 0;
            }
        });
    }, [location.pathname]);

    return null;
}
