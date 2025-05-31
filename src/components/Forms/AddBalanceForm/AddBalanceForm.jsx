import styles from './AddBalanceForm.module.css';
import Button from '../../Button/Button.jsx';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export default function AddBalanceForm({ setIsOpen, setBalance }) {
  const [income, setIncome] = useState('');
  const { enqueueSnackbar } = useSnackbar();

 const handleSubmit = (e) => {
  e.preventDefault();

  const incomeAmount = Number(income);

  if (isNaN(incomeAmount) || incomeAmount <= 0) {
    enqueueSnackbar("Income should be greater than 0", { variant: "warning" });
    return;
  }

  setBalance(prev => {
    const newBalance = prev + incomeAmount;
    localStorage.setItem("balance", newBalance); // ✅ Persist income
    return newBalance;
  });

  setIsOpen(false);
};


  return (
    <div className={styles.formWrapper}>
      <h3>Add Balance</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Income Amount"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          min="1"
          required
        />

        <Button type="submit" style="primary" shadow>
          Add Balance
        </Button>

        <Button
          style="secondary"
          shadow
          handleClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
