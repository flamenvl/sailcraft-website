// Lightweight pointer interaction for the rope.
// This runs only when the hero rope element is present in the markup.
const rope = document.querySelector(".rope-art");
const hero = document.querySelector(".hero");

if (rope && hero && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    rope.style.transform = `translate3d(${relativeX * 12}px, ${relativeY * 9}px, 0) rotate(${relativeX * 1.8}deg)`;
  });

  hero.addEventListener("pointerleave", () => {
    rope.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
  });
}

const menuButton = document.querySelector(".menu-toggle");
if (menuButton) {
  const mobileMenu = document.querySelector("#mobile-menu");

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  };

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// Contact form: send enquiries to the business email through FormSubmit.
// The first real submission triggers a one-time email activation for the recipient.
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const status = document.querySelector("#contact-form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector("span");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Honeypot field: silently ignore automated spam submissions.
    if (contactForm.elements["_honey"].value) return;

    status.textContent = "";
    status.classList.remove("is-error");
    submitButton.disabled = true;
    submitLabel.textContent = "Sending...";

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/example@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error(result.message || "The message could not be sent. Please try again.");
      }

      status.textContent = "Thank you! Your message has been sent. We'll be in touch soon.";
      contactForm.reset();
      submitLabel.textContent = "Message sent";
    } catch (error) {
      status.textContent = "Sorry, we couldn't send your message. Please email example@gmail.com directly.";
      status.classList.add("is-error");
      submitLabel.textContent = "Try again";
    } finally {
      submitButton.disabled = false;
    }
  });
}
