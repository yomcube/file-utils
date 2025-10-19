import { IFile } from "./ifile.js";

export type IFileHandler = {
    displayName: string;
    file: IFile;
    handleFile: (file: File) => void;
}

export var handlers: IFileHandler[] = [];
export function addFileHandler(handler: IFileHandler): void {
    handlers.push(handler);
    let option: HTMLOptionElement = document.createElement("option");
    option.value = handler.displayName;
    option.innerText = handler.displayName;
    document.getElementById("fileType").appendChild(option);
}
export function execHandler(name: string): void {
    for (const handler of handlers) {
        if (handler.displayName == name) {
            document.getElementById("content").innerHTML = ""; // Clear content div
            handler.handleFile((document.getElementById("fileInput") as HTMLInputElement).files[0]);
            return;
        }
    }
}
