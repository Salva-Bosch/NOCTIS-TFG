export async function loadSideNav() {
    const res = await fetch("../components/side-nav.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);
}
