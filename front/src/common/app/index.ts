import type { Router } from "vue-router";

export function reloadPage(router : Router) : void {
    router.go(0)
}

export function redirect(router : Router, path : string) : void {
    router.replace({ path: path, replace: true })
}

export function isAuthOrRedirectToLogin(router : Router) : void {

    if (location.pathname === '/login' || location.pathname === '/reg' || location.pathname === '/promo') {
        return
    }
    
    if (!localStorage.getItem('token')) {
        router.replace({ path: 'login', replace: true })
    }
}

export function scrollToBottomOfChat() {
    var elem = document.getElementsByClassName('chat__container')[0]
    var scrollBottom = elem.scrollHeight + elem.scrollTop + elem.clientHeight;
    elem.scrollTo({ top: scrollBottom+2000 });

}