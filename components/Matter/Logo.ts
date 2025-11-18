import Matter from 'matter-js';

export const logo = () => {
    if (typeof window === 'undefined') return;
    const matterContainer = window.document.querySelector('#matter-container');
    if (!matterContainer) return;

    const Thickness = 100;
    const w = matterContainer.clientWidth;
    const h = matterContainer.clientHeight;

    const {
        Engine,
        Render,
        Runner,
        Bodies,
        Composite,
        Mouse,
        MouseConstraint,
        Body,
        Vector,
    } = Matter;

    const engine = Engine.create();

    // Get pixel ratio for retina displays
    const pixelRatio = window.devicePixelRatio || 1;

    const render = Render.create({
        element: matterContainer as HTMLElement,
        engine,
        options: {
            width: w,
            height: h,
            background: 'transparent',
            wireframes: false,
            showAngleIndicator: false,
            pixelRatio: pixelRatio,
        },
    });

// --- KONFIGURACE PÍSMEN (SVG) ---
// "Design" rozměry – v poměru k tvým SVG
    const letterConfigs = [
        { texture: '/matterjs/1.svg', width: 193, height: 126 },
        { texture: '/matterjs/2.svg', width: 100, height: 100 },
        { texture: '/matterjs/3.svg', width: 193, height: 126 },
        { texture: '/matterjs/3.svg', width: 193, height: 126 },
    ];

// mezera v "design pixelech"
    const designGap = 0;

// celková designová šířka (písmena + mezery)
    const totalDesignWidth =
        letterConfigs.reduce((sum, c) => sum + c.width, 0) +
        designGap * (letterConfigs.length - 1);

// scale tak, aby to přesně vyplnilo šířku kontejneru
    const scale = w / totalDesignWidth;

// ze scale dopočítáme skutečnou mezeru
    const gap = designGap * scale;

// první X – začínáme na úplně levém okraji
    let currentX = 0;

// výška startu
    const startY = 80;

// vytvoření písmen
    const letters = letterConfigs.map((cfg, index) => {
        const width = cfg.width;
        const height = cfg.height;

        const x = currentX + width / 2;
        const y = startY;

        if (index === 1) {
           return Bodies.circle(x, y, width/2, {
                density: 0.001,
                frictionAir: 0.01,
                restitution: 0.2,
                friction: 0.01,
                chamfer: { radius: 5 },
                render: {
                    // fillStyle: 'red',
                    sprite: {
                        texture: cfg.texture,
                        xScale: 0.8,
                        yScale: 0.8,
                    },
                },
            });
        } else {
            return Bodies.rectangle(x, y, width, height, {
                density: 0.001,
                frictionAir: 0.01,
                restitution: 0.2,
                friction: 0.01,
                chamfer: { radius: 5 },
                render: {
                    // fillStyle: 'red',
                    sprite: {
                        texture: cfg.texture,
                        // stejné měřítko jako pro tělo
                        xScale: 0.8,
                        yScale: 0.8,
                    },
                },
            });
        }
    });


    // --- STĚNY / PODLAHA ---
    const leftWall = Bodies.rectangle(
        -Thickness / 2,
        h / 2,
        Thickness,
        h * 5,
        { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' } }
    );
    const rightWall = Bodies.rectangle(
        w + Thickness / 2,
        h / 2,
        Thickness,
        h * 5,
        { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' } }
    );
    const ground = Bodies.rectangle(
        w / 2,
        h - Thickness / 2,
        20000,
        Thickness,
        { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' } }
    );
    const top = Bodies.rectangle(
        w / 2,
        -Thickness / 2,
        20000,
        Thickness,
        { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' } }
    );

    Composite.add(engine.world, [ground, leftWall, rightWall, top, ...letters]);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // --- DRAG & DROP ---
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false },
        },
    });
    Composite.add(engine.world, mouseConstraint);
    (render as any).mouse = mouse;

    // --- LAYOUT PÍSMEN PŘI RESIZE ---
    const layoutLetters = (containerWidth: number) => {
        const totalWidth =
            letterConfigs.reduce((sum, c) => sum + c.width, 0) +
            gap * (letterConfigs.length - 1);
        let cx = containerWidth / 2 - totalWidth / 2;

        letters.forEach((body, i) => {
            const cfg = letterConfigs[i];
            const x = cx + cfg.width / 2;
            const y = body.position.y; // aktuální výška (necháme kde zrovna jsou)
            cx += cfg.width + gap;
            Body.setPosition(body, Vector.create(x, y));
        });
    };

    function onResize(container: Element | null) {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;

        render.canvas.width = w;
        render.canvas.height = h;

        Body.setPosition(
            ground,
            Vector.create(w / 2, h - Thickness / 2)
        );
        Body.setPosition(
            rightWall,
            Vector.create(w + Thickness / 2, h / 2)
        );

        layoutLetters(w);
    }

    layoutLetters(w);
    window.addEventListener('resize', () => onResize(matterContainer));
};
