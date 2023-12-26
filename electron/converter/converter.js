import child_process from "child_process"
import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
import {throwError} from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHELL_INIT = "C:\\Windows\\SysWoW64\\cmd.exe /c";
const COMMA_FIND_REGEX = /(\d+),(\d+)/g;
const COMMA_FIX = "$1.$2";


const fix_json = (path) => {
    const data = fs.readFileSync(path);

    if (data instanceof Error) {
        throwError(data);
        throw data;
    }

    // Replace commas with periods
    const fixed = data.toString().replaceAll(COMMA_FIND_REGEX, COMMA_FIX);

    // Write the file
    fs.writeFileSync(path, fixed);

    let json;

    try {
        json = JSON.parse(fixed);
    } catch (e) {
        throwError(e);
        throw e;
    }

    return json;
}

export const convert = (workspace, path) => {
    const script_path = __dirname + "/scattpro2json.vbs";
    child_process.execSync(`${SHELL_INIT} C:\\Windows\\System32\\cscript.exe ${script_path} "${path}"`, (error, stdout, stderr) => {
        console.log(`Converting ${path} to ${workspace}/data.json...`);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    console.log("Finished processing file. Fixing JSON...");

    return fix_json(workspace + "/data.json");
}