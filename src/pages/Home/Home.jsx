import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import styles from "./Home.module.css";
import TransactionList from "../../components/TransactionList/TransactionList";
import ExpenseForm from "../../components/Forms/ExpenseForm/ExpenseForm";
import Modal from "../../components/Modal/Modal";
import AddBalanceForm from "../../components/Forms/AddBalanceForm/AddBalanceForm";
import PieChart from "../../components/PieChart/PieChart";
import BarChart from "../../components/BarChart/BarChart";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Show/hide modals
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
  const [categoryCount, setCategoryCount] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });

  // Load initial data from localStorage
  useEffect(() => {
    const localBalance = localStorage.getItem("balance");
    const localExpenses = localStorage.getItem("expenses");

    setBalance(localBalance ? Number(localBalance) : 5000);
    if (!localBalance) {
      localStorage.setItem("balance", 5000);
    }

    try {
      const items = JSON.parse(localExpenses);
      setExpenseList(items || []);
    } catch {
      setExpenseList([]);
    }

    setIsMounted(true);
  }, []);

  // Save balance to localStorage (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMounted) {
        localStorage.setItem("balance", balance);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [balance]);

  // Save expenses, calculate totals and category stats
  useEffect(() => {
    if (expenseList.length > 0 || isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    }

    if (expenseList.length > 0) {
      const totalExpense = expenseList.reduce(
        (acc, item) => acc + Number(item.price),
        0
      );
      setExpense(totalExpense);
    } else {
      setExpense(0);
    }

    const { spends, counts } = calculateCategoryStats(expenseList);
    setCategorySpends(spends);
    setCategoryCount(counts);
  }, [expenseList]);

  // Helper function for stats
  function calculateCategoryStats(expenseList) {
    const stats = {
      food: { spend: 0, count: 0 },
      entertainment: { spend: 0, count: 0 },
      travel: { spend: 0, count: 0 },
    };

    expenseList.forEach(({ category, price }) => {
      if (stats[category]) {
        stats[category].spend += Number(price);
        stats[category].count++;
      }
    });

    return {
      spends: {
        food: stats.food.spend,
        entertainment: stats.entertainment.spend,
        travel: stats.travel.spend,
      },
      counts: {
        food: stats.food.count,
        entertainment: stats.entertainment.count,
        travel: stats.travel.count,
      },
    };
  }

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      {/* Cards and pie chart wrapper */}
      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={balance}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={() => setIsOpenBalance(true)}
        />

        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={() => setIsOpenExpense(true)}
        />

        <PieChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Transactions and bar chart wrapper */}
      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={[...expenseList].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )}
          editTransactions={setExpenseList}
          title="Recent Transactions"
          balance={balance}
          setBalance={setBalance}
        />

        <BarChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
        <ExpenseForm
          setIsOpen={setIsOpenExpense}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          setBalance={setBalance}
          balance={balance}
        />
      </Modal>

      <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
        <AddBalanceForm
          setIsOpen={setIsOpenBalance}
          setBalance={setBalance}
        />
      </Modal>
    </div>
  );
}
