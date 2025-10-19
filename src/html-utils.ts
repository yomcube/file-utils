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
        this.element.replaceChildren();
    }
}

export class Tabs {
    element: HTMLDivElement;
    name: string;
    tabs: HTMLDivElement[] = [];

    constructor(name: string, e?: HTMLDivElement) {
        this.element = e == undefined ? document.createElement("div") : e;
        this.element.classList.add("tab-container");
        this.name = name;
    }

    createTab(label: string): HTMLDivElement {
        let tab = document.createElement("div");
        tab.classList.add("tab");

        let input = document.createElement("input");
        input.type = "radio";
        input.name = this.name;
        input.id = `${this.name}-${this.tabs.length}`;

        let lbl = document.createElement("label");
        lbl.htmlFor = input.id;
        lbl.innerText = label;

        let content = document.createElement("div");
        content.classList.add("tab-content");

        tab.append(input, lbl, content);

        this.tabs.push(tab);
        return content;
    }

    displayTabs(): void {
        this.element.replaceChildren(...this.tabs);
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
