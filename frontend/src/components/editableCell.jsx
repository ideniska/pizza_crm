import React, { useState, useEffect } from "react";

const EditableCell = ({ orderId, initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [prevValue, setPrevValue] = useState(initialValue);

  // Update prevValue when initialValue changes to handle external value changes
  useEffect(() => {
    setPrevValue(initialValue);
  }, [initialValue]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSave = async () => {
    console.log("save new comment to DB");
    try {
      const response = await fetch(
        process.env.REACT_APP_UPD_COMMENT_URL,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: orderId, comment: value }),
        }
      );

      if (response.ok) {
        console.log("Comment saved successfully", response);
        setPrevValue(value);
        setIsEditing(false);
      } else {
        console.log("Failed to save comment");
      }
    } catch (error) {
      console.log("Error saving comment:", error);
    }
  };

  const handleCancel = () => {
    setValue(prevValue);
    setIsEditing(false);
  };

  return (
    <td className={`editable-cell ${isEditing ? "editing" : ""}`}>
      {isEditing ? (
        <>
          <input type="text" value={value} onChange={handleChange} />
          <button className="save-btn" onClick={handleSave}>
            ✔️
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            ❌
          </button>
        </>
      ) : (
        <span onClick={handleFocus}>{value}</span>
      )}
    </td>
  );
};

export default EditableCell;
