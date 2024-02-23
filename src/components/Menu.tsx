type Option = {
  key: string | number;
  label: any;
}

type MenuProps = {
  value?: string | number;
  options: Array<Option>; 
  onMouseDown?(key: any, label: any): void;
}

export function Menu (props: MenuProps) {
    return (
      <div className='var-menu' style={{minWidth: "100px"}}>
        <div className='var-menu-item-wrapper'>
          {
            props.options.map((v: any, idx)=> {
              let key:any = v instanceof Object ? v.key : v;
              let label:any = v instanceof Object ? v.label : v;
              return <div key={idx} 
                          className={"var-menu-item " + (props.value === key ? 'selected' : "") }
                          onMouseDown={() => {if (props.onMouseDown instanceof Function) props.onMouseDown(key, label)}}>
                      {label} 
                     </div>
            }) 
          }
        </div>
      </div>
    );
  }