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
    let fileType: HTMLElement|null = document.getElementById("fileType")
    if (fileType) fileType.appendChild(option);
}
export function execHandler(name: string): void {
    for (const handler of handlers) {
        if (handler.displayName == name) {
            let content: HTMLElement|null = document.getElementById("content");
            if (content) content.innerHTML = ""; // Clear content div
            let fileInput = document.getElementById("fileInput");
            if (fileInput != null) {
                // "Object is possibly 'null'."
                // @ts-ignore
                handler.handleFile((fileInput as HTMLInputElement).files[0]);
            }
            return;
        }
    }
}
