import Matter from "matter-js";
import { createRagdoll } from "./createRagdoll";

export class Ragdolls {
  private render: Matter.Render;
  private runner: Matter.Runner;
  constructor(el: HTMLDivElement) {
    const Engine = Matter.Engine,
      Events = Matter.Events,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Common = Matter.Common,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Bodies = Matter.Bodies,
      Vector = Matter.Vector;

    // create engine
    var engine = Engine.create(),
      world = engine.world;

    // create renderer
    var render = Render.create({
      element: el,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
      },
    });
    this.render = render;

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);
    this.runner = runner;

    Composite.add(world, [
      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);

    // add mouse control

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          // allow bodies on mouse to rotate
          // @ts-ignore
          angularStiffness: 0,
          render: {
            visible: false,
          },
        },
      });

    (async () => {
      try {
        // @ts-ignore
        const answer = await DeviceMotionEvent?.requestPermission();
      } catch (e) {}
      // add gyro control
      if (typeof window !== "undefined") {
        var updateGravity = function (event: { gamma: number; beta: number }) {
          console.log(event);
          var orientation =
              typeof window.orientation !== "undefined"
                ? window.orientation
                : 0,
            gravity = engine.gravity;

          if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
          } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
          } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
          } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
          }
        };
        // @ts-ignore
        window.addEventListener("deviceorientation", updateGravity);
      }
    })();

    Composite.add(world, mouseConstraint);

    // Create ragdoll(s)
    Composite.add(world, createRagdoll(200, 200, 1.3));

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
  }

  stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }
}
