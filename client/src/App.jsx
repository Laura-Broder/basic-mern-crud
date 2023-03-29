import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
const API = "http://localhost:5000/api/";

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [editItem, setEditItem] = useState({ name: "", _id: "" });
  const getItems = async (didCancel) => {
    try {
      const list = await axios.get(API);
      if (!didCancel) {
        setItems(list.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    let didCancel = false;
    getItems(didCancel);
    return () => {
      didCancel = true;
    };
  }, []);

  const onNameChange = (e) => {
    setItemName(e.target.value);
  };
  const createNewItem = async () => {
    try {
      const res = await axios.post(API, { name: itemName });
    } catch (error) {
      console.log(error);
    }
  };
  const onAddSubmit = async (e) => {
    e.preventDefault();
    await createNewItem();
    await getItems();
    setItemName("");
  };
  const onDeleteItem = async (itemId) => {
    const res = await axios.delete(`${API}/${itemId}`);
    await getItems();

    const newList = items.filter((item) => item._id !== itemId);
    setItems([...newList]);
  };
  const onEditNameChange = (e) => {
    setEditItem({ ...editItem, name: e.target.value });
  };
  const onEditItem = (itemId, name) => {
    setEditItem({ _id: itemId, name });
  };
  const onEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/${editItem._id}`, {
        name: editItem.name,
      });
      await getItems();
    } catch (error) {
      console.log(error);
    }
    setEditItem({ _id: "", name: "" });
  };
  return (
    <div className="App">
      <form onSubmit={onAddSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          type="text"
          onChange={onNameChange}
          value={itemName}
          required
        />
        <button name="submit-new" type="submit" disabled={!itemName}>
          Add
        </button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index} id={item._id}>
            {editItem._id === item._id ? (
              <form onSubmit={onEditSubmit}>
                <label htmlFor="editName">Name:</label>
                <input
                  name="editName"
                  type="text"
                  onChange={onEditNameChange}
                  value={editItem.name}
                  required
                />
                <button name="submit-edit" type="submit">
                  Save
                </button>
              </form>
            ) : (
              <>
                <span>{item.name}</span>
                <button
                  type="button"
                  name="delete"
                  onClick={() => onDeleteItem(item._id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  name="edit"
                  onClick={() => onEditItem(item._id, item.name)}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
