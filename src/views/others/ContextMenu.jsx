const ContextMenu = ({ x, y, onClose, options }) => {
  return (
    <div>
      <ul>
        {options.map((option, index) => (
          <li key={index} className="ne" onClick={() => option.handler()}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
