const { exec } = require("child_process");
const cwd = process.cwd();
const parentDir = cwd.substring(0, cwd.lastIndexOf("/"));
console.log("parentDir:", parentDir);
exec("pwd", { cwd: parentDir }, (err, stdout, stderr) => {
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
    console.log("err:", err);
});
