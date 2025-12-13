export class Table {
    element: HTMLTableElement;

    constructor(e?: HTMLTableElement) {
        this.element = e == undefined ? document.createElement("table") : e;
    }

    get style(): CSSStyleDeclaration {
        return this.element.style;
    }
    set style(value: string) {
        this.element.style = value;
    }

    addRow(header: any, data: any): void {
        var row = document.createElement("tr");
        var h = document.createElement("th");
        var d = document.createElement("td");
        h.innerHTML = header;
        d.innerHTML = data;
        row.append(h, d);
        this.element.appendChild(row);
    }
    addFullHeader(header: any): void {
        var row = document.createElement("tr");
        var h = document.createElement("th");
        h.colSpan = 2;
        h.innerHTML = header;
        h.style.textAlign = "center";
        row.appendChild(h);
        this.element.appendChild(row);
    }
    clear(): void {
        this.element.replaceChildren();
    }
}

export class Tabs {
    element: HTMLDivElement;
    name: string;
    anchors: HTMLAnchorElement[] = [];
    tabs: HTMLDivElement[] = [];

    constructor(name: string, e?: HTMLDivElement) {
        this.element = e == undefined ? document.createElement("div") : e;
        this.element.classList.add("tab-container");
        this.name = name;
    }

    get style(): CSSStyleDeclaration {
        return this.element.style;
    }
    set style(value: string) {
        this.element.style = value;
    }

    createTab(label: string): [HTMLDivElement, HTMLAnchorElement, HTMLDivElement] {
        let id = `${this.name}-${this.tabs.length}`;

        let tab = document.createElement("div");
        tab.id = id;
        tab.classList.add("tab");

        let anchor = document.createElement("a");
        anchor.href = `#${id}`;
        anchor.innerText = label;
        this.anchors.push(anchor);

        let tab_body = document.createElement("div");
        tab_body.classList.add("tab-body");

        tab.append(anchor, tab_body);
        this.tabs.push(tab);

        return [tab, anchor, tab_body];
    }

    displayTabs(): void {
        /*let div = document.createElement("div");
        div.classList.add("tab-anchors");
        for (const a of this.anchors) {
            div.appendChild(a);
        }
        this.element.replaceChildren(div, ...this.tabs);*/
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
