export class Table {
    element: HTMLTableElement;

    constructor(e?: HTMLTableElement) {
        this.element = e == undefined ? document.createElement("table") : e;
    }

    addRow(header: any, data: any): void {
        var row = document.createElement("tr");
        var h = document.createElement("th");
        var d = document.createElement("td");
        h.innerHTML = header;
        d.innerHTML = data;
        row.appendChild(h);
        row.appendChild(d);
        this.element.appendChild(row);
    }
    clear() {
        this.element.innerHTML = "";
    }
}

export function yesno(b: boolean | number): string {
    return b ? "Yes" : "No";
}
export function endisabled(b: boolean | number): string {
    return b ? "Enabled" : "Disabled";
}

export function code(str: string): string {
    return `<code>${str}</code>`;
}

export function tooltip(text: string, tooltip_text: string) {
    return `<span class="tooltip" data-tooltip="${tooltip_text}">${text}</span>`;
}

export function arrayToHex(data: Uint8Array, displayAsCode?: boolean): string {
    let str = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
	if (displayAsCode) {
        str = code(str);
    }
    return str;
}

export function numToHex(num: number, targetLength: number, displayAsCode?: boolean): string {
    let str = "0x" + num.toString(16).padStart(targetLength, '0');
    if (displayAsCode) {
        str = code(str);
    }
    return str;
}

export function leftFillNum(num, targetLength) {
	return num.toString().padStart(targetLength, "0");
}
