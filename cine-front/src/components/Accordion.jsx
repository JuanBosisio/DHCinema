const Accordion = ({title, content, active, onChange,index}) => {
 

    return (
        <div className="accordion-item">
          <div className="accordion-title" onClick={() => {
              onChange(index,!active) 
              
            }}>
            <div>{title}</div>
            <div>{active ? <img src="/icons/close-accordion.svg"/> : <img src="/icons/open-accordion.svg"/>}</div>
          </div>
          {active && <div className="accordion-content">{content}</div>}
        </div>
      );
}

export default Accordion;