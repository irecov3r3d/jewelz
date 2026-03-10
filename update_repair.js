const fs = require('fs');
const content = fs.readFileSync('lib/agent/repair.ts', 'utf8');

const target = `      if (repairResult.success) {
        await prisma.activity.create({
          data: {
            sessionId,
            type: "THOUGHT",
            content: \`Repair successful for command '\${failedCommand}'.\`,
          },
        });
        return true;
      } else {
         await prisma.activity.create({
          data: {
            sessionId,
            type: "THOUGHT",
            content: \`Repair failed for command '\${failedCommand}'. Manual intervention may be needed.\`,
          },
        });
        return false;
      }`;

const replacement = `      const content = repairResult.success
        ? \`Repair successful for command '\${failedCommand}'.\`
        : \`Repair failed for command '\${failedCommand}'. Manual intervention may be needed.\`;

      await prisma.activity.create({
        data: {
          sessionId,
          type: "THOUGHT",
          content,
        },
      });

      return repairResult.success;`;

if (content.includes(target)) {
  fs.writeFileSync('lib/agent/repair.ts', content.replace(target, replacement));
  console.log('Successfully updated lib/agent/repair.ts');
} else {
  console.log('Could not find the target codeblock.');
}
