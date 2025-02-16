document.addEventListener("DOMContentLoaded", () => {
    function showPage(page) {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(page).classList.add("active");
    }

    // Set default page on load
    showPage("main");

    document.querySelectorAll("nav ul li a").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute("onclick").match(/'(\w+)'/)[1];
            showPage(pageId);
        });
    });

    // Cursor Customization
    const cursor = document.getElementById("cursor");
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener("click", (e) => {
        const clickEffect = document.createElement("div");
        clickEffect.classList.add("click-effect");
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);

        setTimeout(() => {
            clickEffect.remove();
        }, 500);
    });

    // Interactive Background
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let points = [];
    const numPoints = 150;
    const maxDistance = 120;
    let mouse = { x: null, y: null };

    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connect points to cursor
            if (mouse.x && mouse.y) {
                const dx = points[i].x - mouse.x;
                const dy = points[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance * 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = "cyan";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
