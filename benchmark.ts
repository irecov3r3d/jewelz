import prisma from "./lib/prisma.ts";

async function main() {
  try {
    const session = await prisma.session.create({
      data: {
        objective: "Test baseline",
        repo: "test-repo",
      },
    });
    console.log("Session created:", session.id);

    // Warmup
    for(let i=0; i<5; i++) {
        await prisma.errorLog.create({
            data: {
              sessionId: session.id,
              command: "warmup",
              error: "warmup error",
            },
        });
    }

    const iterations = 10;
    let sequentialTotal = 0;
    for(let i=0; i<iterations; i++) {
        const start = performance.now();
        await prisma.errorLog.create({
          data: {
            sessionId: session.id,
            command: "test",
            error: "test error",
          },
        });
        await prisma.activity.create({
          data: {
            sessionId: session.id,
            type: "THOUGHT",
            content: "test activity",
          },
        });
        const end = performance.now();
        sequentialTotal += (end - start);
    }
    console.log(`Average Sequential time: ${sequentialTotal / iterations}ms`);

    let parallelTotal = 0;
    for(let i=0; i<iterations; i++) {
        const start2 = performance.now();
        await Promise.all([
          prisma.errorLog.create({
            data: {
              sessionId: session.id,
              command: "test2",
              error: "test error 2",
            },
          }),
          prisma.activity.create({
            data: {
              sessionId: session.id,
              type: "THOUGHT",
              content: "test activity 2",
            },
          }),
        ]);
        const end2 = performance.now();
        parallelTotal += (end2 - start2);
    }
    console.log(`Average Parallel time: ${parallelTotal / iterations}ms`);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
