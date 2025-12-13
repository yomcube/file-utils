import { addFileHandler, execHandler, handlers } from "./handler.js";

const fileType = document.getElementById("fileType") as HTMLSelectElement;

document.getElementById("fileInput").addEventListener("change", () => {
    execHandler(fileType.value);
}, false);

// Create file handlers
import { DTMHandler } from "./handlers/dtm.js";
addFileHandler(new DTMHandler());

import { M64Handler } from "./handlers/m64.js";
addFileHandler(new M64Handler());

import { RKGHandler } from "./handlers/rkg.js";
addFileHandler(new RKGHandler());

import { MK7_DATHandler } from "./handlers/mk7_dat.js";
addFileHandler(new MK7_DATHandler());

/*import { RksysHandler } from "./handlers/rksys.js";
addFileHandler(new RksysHandler());*/

import { KRKGHandler } from "./handlers/kinoko.js";
addFileHandler(new KRKGHandler());

var params = (new URL(document.location.toString())).searchParams;
if (params.has("f")) {
    fileType.value = params.get("f");
}
