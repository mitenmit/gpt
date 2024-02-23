

type ListProps = {
    style?: Record<string, any>;
    items: Array<any>;
    selected?: any;
    onClick?(k: any): void;
}

export function List(props: ListProps) {
    return (
        <ul className="list" style={props?.style}>
            {
                props.items.map( (v, i) => {
                    let key: any = v instanceof Object ? v.key : v;
                    let label: any = v instanceof Object ? v.label : v;
                    return  <li key = {i} 
                                className = {"list-item " + (props.selected === key ? " selected" : "")}
                                onClick = {() => {if (props.onClick instanceof Function) props.onClick(key)}}>
                                {label}
                            </li>
                })
            }
        </ul>
    );
}