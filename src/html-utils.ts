export class Table {
    element: HTMLTableElement;
    width: number = 2;

    constructor(e?: HTMLTableElement | null, width: number = 2) {
        this.element = e ?? document.createElement("table");
        this.width = width;
    }

    get style(): CSSStyleDeclaration {
        return this.element.style;
    }
    set style(value: string) {
        this.element.style = value;
    }

    #_addRow(header: any, dataIsHeader: boolean, ...data: any[]): void {
        var row = document.createElement("tr");
        var h = document.createElement("th");
        h.innerHTML = header;

        row.appendChild(h);

        for (let d of data) {
            var td = document.createElement(dataIsHeader ? "th" : "td");
            if (d instanceof HTMLElement) {
                td.appendChild(d);
            } else {
                td.innerHTML = d;
            }
            row.appendChild(td);
        }

        this.element.appendChild(row);
    }
    addRow(header: any, ...data: any[]): void {
        this.#_addRow(header, false, ...data);
    }
    addHeader(header: any, ...data: any[]): void {
        this.#_addRow(header, true, ...data);
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

export class Details {
    trueElement: HTMLDetailsElement;
    summaryElement: HTMLElement;
    id?: string|null;
    backToTopAnchor?: HTMLAnchorElement;

    constructor(summary: string, id?: string|null, e?: HTMLDetailsElement) {
        this.trueElement = e ?? document.createElement("details");
        this.summaryElement = document.createElement("summary");
        this.summaryElement.innerHTML = summary;
        this.appendChild(this.summaryElement);
        this.id = id;

        if (id) {
            this.trueElement.id = id;
            this.backToTopAnchor = document.createElement("a");
            this.backToTopAnchor.href = `#${id}`;
            this.backToTopAnchor.innerText = "Back to top";
        }
    }
    appendChild(node: Node) {
        this.trueElement.appendChild(node);
    }
    get element(): HTMLDetailsElement {
        if (this.backToTopAnchor) {
            this.appendChild(this.backToTopAnchor);
        }
        return this.trueElement;
    }
}

// https://stackoverflow.com/a/12034334
var entityMap: any = {
  '&': '&amp;',  '<': '&lt;',    '>': '&gt;',    '"': '&quot;',
  "'": '&#39;',  '/': '&#x2F;',  '`': '&#x60;',  '=': '&#x3D;'
};
export function sanitize(str: string) {
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
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

export function leftFillNum(num: number, targetLength: number) {
	return num.toString().padStart(targetLength, "0");
}
