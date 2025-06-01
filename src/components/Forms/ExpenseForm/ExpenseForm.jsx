import styles from './ExpenseForm.module.css';
import Button from '../../Button/Button.jsx';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

export default function ExpenseForm({
  setIsOpen,
  expenseList,
  setExpenseList,
  editId,
  setBalance,
  balance
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    date: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleAdd = (e) => {
  e.preventDefault();
  const price = Number(formData.price);

  if (price > balance) {
    enqueueSnackbar("Price should be less than or equal to wallet balance", { variant: "warning" });
    return;
  }

  const lastId = expenseList.length > 0 ? expenseList[0].id : 0;

  const newExpense = {
    ...formData,
    id: lastId + 1,
    price: price
  };

  const updatedList = [newExpense, ...expenseList];
  setExpenseList(updatedList);
  localStorage.setItem("expenses", JSON.stringify(updatedList));

  setBalance(prev => {
    const newBalance = prev - price; // ✅ subtract expense from balance
    localStorage.setItem("balance", newBalance);
    return newBalance;
  });

  setFormData({ title: '', category: '', price: '', date: '' });
  setIsOpen(false);
};


 const handleEdit = (e) => {
  e.preventDefault();

  const updatedList = expenseList.map(item => {
    if (item.id === editId) {
      const oldPrice = Number(item.price);
      const newPrice = Number(formData.price);
      const difference = oldPrice - newPrice;

      if (difference < 0 && Math.abs(difference) > balance) {
        enqueueSnackbar("Price should not exceed the wallet balance", { variant: "warning" });
        return item;
      }

      setBalance(prev => {
        const updated = prev + difference;
        localStorage.setItem("balance", updated); // ✅ persist
        return updated;
      });

      return { ...formData, id: editId, price: newPrice };
    }
    return item;
  });

  setExpenseList(updatedList);
  localStorage.setItem("expenses", JSON.stringify(updatedList)); // ✅ persist
  setIsOpen(false);
};

  useEffect(() => {
    if (editId) {
      const existing = expenseList.find(item => item.id === editId);
      if (existing) {
        setFormData({
          title: existing.title,
          category: existing.category,
          price: existing.price,
          date: existing.date,
        });
      }
    }
  }, [editId, expenseList]);

  return (
    <div className={styles.formWrapper}>
      <h3>{editId ? 'Edit Expense' : 'Add Expenses'}</h3>
      <form onSubmit={editId ? handleEdit : handleAdd}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          min="1"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select category</option>
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
          <option value="travel">Travel</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <Button type="submit" style="primary" shadow>
          {editId ? 'Edit Expense' : 'Add Expense'}
        </Button>

        <Button style="secondary" shadow handleClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </form>
    </div>
  );
}
