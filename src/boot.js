// boot.js — Entry point loaded by index.html
// Routes between development (HTTP dev server) and production (local assets).
// main.js is never imported directly; it's loaded dynamically so the dev server
// can serve a freshly compiled version on every reload.

const DEV_MODE = typeof __DEV_MODE__ !== "undefined" && __DEV_MODE__;
const DEV_HOST = typeof __DEV_HOST__ !== "undefined" ? __DEV_HOST__ : "";
const DEV_PORT = typeof __DEV_PORT__ !== "undefined" ? __DEV_PORT__ : "";
const DEV_PROTO = typeof __DEV_PROTO__ !== "undefined" ? __DEV_PROTO__ : "";
const DEV_ORIGIN =
	DEV_HOST && DEV_PORT && DEV_PROTO
		? `${DEV_PROTO}://${DEV_HOST}:${DEV_PORT}`
		: "";

const loadScript = (src) => {
	const el = document.createElement("script");
	el.src = src;
	document.head.appendChild(el);
};

const loadCSS = (href) => {
	const el = document.createElement("link");
	el.rel = "stylesheet";
	el.href = href;
	document.head.appendChild(el);
};

const bootDev = () => {
	const origin = DEV_ORIGIN || "";
	loadCSS(`${origin}/build/main.css`);
	loadScript(`${origin}/build/main.js`);

	const wsProto = location.protocol === "https:" ? "wss" : "ws";
	const wsHost = DEV_HOST && DEV_PORT ? `${DEV_HOST}:${DEV_PORT}` : location.host;
	const connectWS = () => {
		let ws;
		try {
			ws = new WebSocket(`${wsProto}://${wsHost}`);
		} catch {
			setTimeout(connectWS, 1000);
			return;
		}
		ws.onmessage = ({ data }) => {
			if (data === "reload") location.reload();
		};
		ws.onclose = () => setTimeout(connectWS, 1000);
		ws.onerror = () => {};
	};
	connectWS();
};

const bootProd = () => {
	loadCSS("./build/main.css");
	loadScript("./build/main.js");
};

if (DEV_MODE) {
	bootDev();
} else {
	bootProd();
}
