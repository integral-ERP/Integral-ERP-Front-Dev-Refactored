const ContextMenu = ({ x, y, onClose, options }) => {

  const handleAndClose = (option) => {
    option();
    onClose();
  }

  return (
    <div 
    className="context-menu"
          style={{
            position: "absolute",
            top: y,
            left: x,
          }}>
      <ul>
        {options.map((option, index) => (
          <li key={index} className="ne" onClick={() => {handleAndClose(option.handler)}}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
