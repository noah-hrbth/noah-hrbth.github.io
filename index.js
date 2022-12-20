/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
	if (e.key === "Tab") {
		document.body.classList.add("user-is-tabbing");

		window.removeEventListener("keydown", handleFirstTab);
		window.addEventListener("mousedown", handleMouseDownOnce);
	}
};

const handleMouseDownOnce = () => {
	document.body.classList.remove("user-is-tabbing");

	window.removeEventListener("mousedown", handleMouseDownOnce);
	window.addEventListener("keydown", handleFirstTab);
};

window.addEventListener("keydown", handleFirstTab);

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
	backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
	backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
};

window.addEventListener("scroll", () => {
	if (window.scrollY > 700) {
		isBackToTopRendered = true;
		alterStyles(isBackToTopRendered);
	} else {
		isBackToTopRendered = false;
		alterStyles(isBackToTopRendered);
	}
});

const checkAppleDevice = () => /iPhone|iPad/.test(navigator.platform);

if (checkAppleDevice() && window.innerWidth < 600) {
	const header = document.querySelector(".header");
	header.classList.add("apple-device-mobile");

	window.onscroll = () => {
		const scrollPosition = window.scrollY;

		header.style.backgroundPosition = `${scrollPosition}px`;
	};
}
