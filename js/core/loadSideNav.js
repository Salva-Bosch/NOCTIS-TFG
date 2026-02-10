export async function loadSideNav() {
    const res = await fetch("/pages/app/components/side-nav.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);
}
