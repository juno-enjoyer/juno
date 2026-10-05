const titleA = ' >w<';
const titleB = ' owo';

function deleteToHash(onDone) {
    const interval = setInterval(() => {
        const title = document.title;
        if (title.length <= 1) {
            clearInterval(interval);
            onDone && onDone();
        } else {
            document.title = title.slice(0, -1);
        }
    }, 150);
}

function typeSuffix(text, onDone) {
    let i = 0;
    const interval = setInterval(() => {
        document.title += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            onDone && onDone();
        }
    }, 300);
}

function runTitleCycle() {
    setTimeout(() => {
        deleteToHash(() => {
            const suffixB = titleB.slice(1);
            typeSuffix(suffixB, () => {
                setTimeout(() => {
                    deleteToHash(() => {
                        const suffixA = titleA.slice(1);
                        typeSuffix(suffixA, () => {
                            runTitleCycle();
                        });
                    });
                }, 3000);
            });
        });
    }, 3000);
}

function startNameSparkles() {
    const nameContainer = document.querySelector('.name-container');
    const displayName = document.getElementById('displayName');
    if (!nameContainer || !displayName) return;

    setInterval(() => {
        const width = displayName.offsetWidth;
        const height = displayName.offsetHeight;

        const sparkle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        sparkle.setAttribute("viewBox", "0 0 24 24");
        sparkle.classList.add("sparkle-particle");

        const size = Math.random() * 8 + 8;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        const colors = ['#B8BCFC', '#C8CCFC', '#D8DCFC', '#E8ECFC'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12,0 Q12,12 24,12 Q12,12 12,24 Q12,12 0,12 Q12,12 12,0 Z");
        path.setAttribute("fill", color);
        sparkle.appendChild(path);

        sparkle.style.filter = `drop-shadow(0 0 3px ${color})`;

        const posX = Math.random() * width;
        const posY = Math.random() * height;
        sparkle.style.left = `${posX}px`;
        sparkle.style.top = `${posY}px`;

        const driftXMid = (Math.random() - 0.5) * 15;
        const driftYMid = -10 - Math.random() * 10;
        const driftXEnd = driftXMid * 2 + (Math.random() - 0.5) * 10;
        const driftYEnd = -30 - Math.random() * 20;

        sparkle.style.setProperty('--drift-x-mid', `${driftXMid}px`);
        sparkle.style.setProperty('--drift-y-mid', `${driftYMid}px`);
        sparkle.style.setProperty('--drift-x-end', `${driftXEnd}px`);
        sparkle.style.setProperty('--drift-y-end', `${driftYEnd}px`);

        const duration = Math.random() * 0.8 + 1.2;
        sparkle.style.animationDuration = `${duration}s`;

        nameContainer.appendChild(sparkle);
        setTimeout(() => {
            sparkle.remove();
        }, duration * 1000);
    }, 120);
}

function enterSite() {
    const entrance = document.getElementById('entrance');
    const scrollContainer = document.getElementById('scroll-container');

    entrance.onclick = null;

    entrance.style.opacity = '0';
    entrance.style.visibility = 'hidden';

    scrollContainer.style.visibility = 'visible';
    scrollContainer.style.opacity = '1';

    document.getElementById('section1').classList.add('is-visible');

    const music = document.getElementById('bgMusic');
    music.volume = 0.2;
    music.play().catch(() => { });
    runTitleCycle();
    startNameSparkles();
}

window.enterSite = enterSite;

async function fetchDiscordData() {
    try {
        const res = await fetch('https://avatar-cyan.vercel.app/api/987994517678477323');
        if (res.ok) {
            const data = await res.json();
            const displayName = data.display_name || data.global_name || data.username;
            if (displayName) {
                const nameEl = document.getElementById('displayName');
                if (nameEl) {
                    nameEl.textContent = displayName;
                }
            }
            if (data.avatarUrl) {
                const pfpImg = document.querySelector('.pfp-img');
                if (pfpImg) {
                    pfpImg.src = data.avatarUrl;
                }
            }
        }
    } catch (err) {
        console.error('Error fetching Discord data:', err);
    }
}

fetchDiscordData();
