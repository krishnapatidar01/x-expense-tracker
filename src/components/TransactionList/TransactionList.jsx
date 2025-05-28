import TransactionCard from '../TransactionCard/TransactionCard';
import styles from './TransactionList.module.css';
import Modal from '../Modal/Modal';
import ExpenseForm from '../Forms/ExpenseForm/ExpenseForm';
import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';

export default function TransactionList({ transactions, title, editTransactions, balance, setBalance }) {
  const [editId, setEditId] = useState(0);
  const [isDisplayEditor, setIsDisplayEditor] = useState(false);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const maxRecords = 3;
  const [totalPages, setTotalPages] = useState(0);

  const handleDelete = (id) => {
    const item = transactions.find((i) => i.id === id);
    if (item) {
      setBalance(prev => prev + Number(item.price));

      const updatedTransactions = transactions.filter(i => i.id !== id);
      editTransactions(updatedTransactions);

      // Update totalPages after deletion
      const newTotalPages = Math.ceil(updatedTransactions.length / maxRecords);
      setTotalPages(newTotalPages);

      // Adjust current page if needed
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsDisplayEditor(true);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * maxRecords;
    const endIndex = startIndex + maxRecords;
    setCurrentTransactions(transactions.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(transactions.length / maxRecords));
  }, [currentPage, transactions]);

  return (
    <div className={styles.transactionsWrapper}>
      {title && <h2>{title}</h2>}

      {transactions.length > 0 ? (
        <div className={styles.list}>
          {currentTransactions.map(transaction => (
            <TransactionCard
              details={transaction}
              key={transaction.id}
              handleDelete={() => handleDelete(transaction.id)}
              handleEdit={() => handleEdit(transaction.id)}
            />
          ))}
          {totalPages > 1 && (
            <Pagination
              updatePage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyTransactionsWrapper}>
          <p>No transactions!</p>
          {/* Optional: Add a button to add a transaction */}
        </div>
      )}

      <Modal isOpen={isDisplayEditor} setIsOpen={setIsDisplayEditor}>
        <ExpenseForm
          editId={editId}
          expenseList={transactions}
          setExpenseList={editTransactions}
          setIsOpen={setIsDisplayEditor}
          balance={balance}
          setBalance={setBalance}
        />
      </Modal>
    </div>
  );
}

