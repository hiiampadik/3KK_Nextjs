import Matter from 'matter-js';

export const logo = ()=> {
    if (typeof window === 'undefined') return;
    const matterContainer = window.document.querySelector('#matter-container');
    if (!matterContainer) return;

    const Thickness = 100;
    const w = matterContainer.clientWidth;
    const h = matterContainer.clientHeight;
    const Engine = Matter.Engine;
    const Events = Matter.Events;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Common = Matter.Common;
    const Composite = Matter.Composite;
    const Composites = Matter.Composites;
    const engine = Engine.create();
    const render = Render.create({
        element: matterContainer as HTMLElement,
        engine: engine,
        options: {
            width: w,
            height: h,
            background: 'transparent',
            wireframes: false,
            showAngleIndicator: false
        }
    });

    const stack = Composites.stack(20, 20, 1, 2, 0, 0, (x: number, y: number)=>{

        return Bodies.rectangle(0, -0, Common.random(100, 250), Common.random(100, 250), {
            density: 0.001,
            frictionAir: 0,
            restitution: 0.2,
            friction: 0.01,
            render: {
                fillStyle: `hsl(${Math.random() * 360}, 50%, 50%)`,
            }
        })

    });

    const leftWall = Bodies.rectangle(- Thickness / 2, h / 2, Thickness, h * 5, {isStatic: true, render: {fillStyle: `rgba(0, 0, 0, 0)`}});
    const rightWall = Bodies.rectangle(w + Thickness / 2, h / 2, Thickness, h * 5, {isStatic: true, render: {fillStyle: `rgba(0, 0, 0, 0)`}});
    const ground = Bodies.rectangle(w / 2, h + Thickness / 2, 20000, Thickness, {isStatic: true, render: {fillStyle: `rgba(0, 0, 0, 0)`}});
    const top = Bodies.rectangle(w / 2, - Thickness / 2, 20000, Thickness, {isStatic: true, render: {fillStyle: `rgba(0, 0, 0, 0)`}});

    // オブジェクトが表示範囲外に出て消えないようにする壁、床を追加
    Composite.add(engine.world, [ground, leftWall, rightWall, top]);

    // レンダラーを実行する
    Render.run(render);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    function onResize(matterContainer: Element | null) {

        if (!matterContainer) return;
        const w = matterContainer.clientWidth;
        const h = matterContainer.clientHeight;

        render.canvas.width = w;
        render.canvas.height = h;

        Matter.Body.setPosition(
            ground,
            Matter.Vector.create(
                w / 2,
                h + Thickness / 2,
            )
        );

        // 壁 右を修正
        Matter.Body.setPosition(
            rightWall,
            Matter.Vector.create(
                w + Thickness / 2,
                h / 2,
            )
        );

        Composite.add(engine.world, stack);
    }

    onResize(matterContainer);
    window.addEventListener('resize', e=>onResize(matterContainer));

    const mouse = Matter.Mouse.create(render.canvas);

    Events.on(engine, 'beforeUpdate', () => {

        const mousePos = mouse.position;

        stack.bodies.forEach(body => {

            const dx = body.position.x - mousePos.x;
            const dy = body.position.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 矩形のサイズを考慮（最大辺の半分）＋余裕
            const bounds = body.bounds;
            const size = Math.max(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
            const margin = 0;
            const effectiveRadius = size / 2 + margin; // marginはカーソルから矩形までの反応余白（値が大きいとカーソルから離れたところで衝突がおこる）

            if (distance < effectiveRadius) {

                const forceMagnitude = 0.008;
                const force = {
                    x: dx * forceMagnitude,
                    y: dy * forceMagnitude,
                };

                Matter.Body.applyForce(body, body.position, force);
            }
        });
    });
}