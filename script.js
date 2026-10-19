
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    const applyTheme = theme => {
        const isLight = theme === "light";

        body.classList.toggle("light-mode", isLight);

        if (themeToggle) {
            themeToggle.textContent = isLight
                ? "🌙 Escuro"
                : "☀️ Claro";
        }
    };

    const savedTheme = localStorage.getItem("portfolio-theme");

    applyTheme(
        savedTheme === "light"
            ? "light"
            : "dark"
    );

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = body.classList.contains("light-mode")
                ? "light"
                : "dark";

            const newTheme = currentTheme === "light"
                ? "dark"
                : "light";

            applyTheme(newTheme);
            localStorage.setItem("portfolio-theme", newTheme);
        });
    }

    const animElements = document.querySelectorAll(".scroll-anim");

    const checkScroll = () => {
        animElements.forEach(element => {
            const position = element.getBoundingClientRect().top;

            if (position < window.innerHeight - 80) {
                element.classList.add("show");
            }
        });
    };

    if (animElements.length) {
        window.addEventListener("scroll", checkScroll, {
            passive: true
        });

        checkScroll();
    }

    const track = document.getElementById("carouselTrack");
    const prevButton = document.getElementById("btnPrev");
    const nextButton = document.getElementById("btnNext");

    let currentStep = 0;

    const getVisibleCards = () => {
        if (window.innerWidth > 1024) {
            return 3;
        }

        if (window.innerWidth > 768) {
            return 2;
        }

        return 1;
    };

    const updateCarousel = () => {
        if (!track) {
            return;
        }

        const cards = track.querySelectorAll(".jornada-card");

        if (!cards.length) {
            return;
        }

        const visibleCards = getVisibleCards();

        const maxStep = Math.max(
            0,
            cards.length - visibleCards
        );

        currentStep = Math.min(
            Math.max(currentStep, 0),
            maxStep
        );

        const cardWidth = cards[0].getBoundingClientRect().width;

        const gap = parseFloat(
            getComputedStyle(track).gap
        ) || 20;

        track.style.transform =
            `translateX(-${currentStep * (cardWidth + gap)}px)`;

        if (prevButton) {
            prevButton.disabled = currentStep === 0;
        }

        if (nextButton) {
            nextButton.disabled = currentStep === maxStep;
        }
    };

    if (track && prevButton && nextButton) {
        nextButton.addEventListener("click", () => {
            const cards = track.querySelectorAll(".jornada-card");

            const visibleCards = getVisibleCards();

            const maxStep = Math.max(
                0,
                cards.length - visibleCards
            );

            currentStep =
                currentStep < maxStep
                    ? currentStep + 1
                    : 0;

            updateCarousel();
        });

        prevButton.addEventListener("click", () => {
            const cards = track.querySelectorAll(".jornada-card");

            const visibleCards = getVisibleCards();

            const maxStep = Math.max(
                0,
                cards.length - visibleCards
            );

            currentStep =
                currentStep > 0
                    ? currentStep - 1
                    : maxStep;

            updateCarousel();
        });

        window.addEventListener(
            "resize",
            updateCarousel,
            {
                passive: true
            }
        );

        updateCarousel();
    }

    const telInput = document.getElementById("telefone");

    if (telInput) {
        telInput.addEventListener("input", event => {
            let value = event.target.value
                .replace(/\D/g, "")
                .substring(0, 11);

            if (value.length <= 2) {
                value = value.replace(
                    /^(\d{0,2})/,
                    "($1"
                );
            } else if (value.length <= 6) {
                value = value.replace(
                    /^(\d{2})(\d{0,4})/,
                    "($1) $2"
                );
            } else if (value.length <= 10) {
                value = value.replace(
                    /^(\d{2})(\d{4})(\d{0,4})/,
                    "($1) $2-$3"
                );
            } else {
                value = value.replace(
                    /^(\d{2})(\d{5})(\d{0,4})/,
                    "($1) $2-$3"
                );
            }

            event.target.value = value;
        });
    }

    const modal = document.getElementById("customModal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("formContato");

    const openModal = content => {
        if (!modal || !modalBody) {
            return;
        }

        modalBody.innerHTML = content;
        modal.classList.add("active");
        document.body.classList.add("modal-open");
    };

    const closeModalFunction = () => {
        if (!modal) {
            return;
        }

        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".click-modal").forEach(card => {
        card.addEventListener("click", () => {
            const titleElement = card.querySelector("h3");

            const title = titleElement
                ? titleElement.textContent.trim()
                : "Projeto";

            openModal(`
                <h3 style="color:#a855f7; margin-bottom:10px;">
                    🔍 Detalhes do Projeto
                </h3>

                <h4>${title}</h4>

                <p style="margin-top:10px; font-size:0.95rem;">
                    Link complementar ou reprodutor de mídia do projeto.
                </p>
            `);
        });
    });

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const nome = document.getElementById("nome")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const telefone = telInput?.value.trim();
            const mensagem = document.getElementById("mensagem")?.value.trim();

            if (!nome || !email || !telefone || !mensagem) {
                openModal(`
                    <h3 style="color:#ef4444; margin-bottom:10px;">
                        ⚠️ Preencha todos os campos
                    </h3>

                    <p>
                        Preencha nome, telefone, e-mail e mensagem
                        antes de enviar.
                    </p>
                `);

                return;
            }

            const whatsappMessage =
                "Olá, Bernardo! Recebi uma nova mensagem pelo seu portfólio.%0A%0A" +
                "Nome: " + encodeURIComponent(nome) + "%0A" +
                "Telefone: " + encodeURIComponent(telefone) + "%0A" +
                "E-mail: " + encodeURIComponent(email) + "%0A%0A" +
                "Mensagem:%0A" +
                encodeURIComponent(mensagem);

            const whatsappUrl =
                "https://wa.me/5531985977513?text=" +
                whatsappMessage;

            window.open(whatsappUrl, "_blank");

            form.reset();
        });
    }

    if (closeModal) {
        closeModal.addEventListener(
            "click",
            closeModalFunction
        );
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModalFunction();
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            modal?.classList.contains("active")
        ) {
            closeModalFunction();
        }
    });
});

