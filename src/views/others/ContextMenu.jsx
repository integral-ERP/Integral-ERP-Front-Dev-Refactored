const ContextMenu = ({ x, y, onClose, onOptionClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
      }}
    >
      <ul>
        <li onClick={() => onOptionClick('Option 1')}>Option 1</li>
        <li onClick={() => onOptionClick('Option 2')}>Option 2</li>
        <li onClick={() => onOptionClick('Option 3')}>Option 3</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
