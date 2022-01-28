import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface TransactionsProps {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: Date;
}

interface TransactionsContextProps {
  transactions: TransactionsProps[];
  createNewTransaction: (newTransaction: TransactionsProps) => void;
}

export const TransactionsContext = createContext<TransactionsContextProps>(
  {} as TransactionsContextProps
);

export const TransactionsProvider: React.FC = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);

  function createNewTransaction(newTransaction: TransactionsProps) {
    setTransactions([...transactions, newTransaction]);
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/transactions");
        setTransactions(data.transactions);
      } catch (error) {}
    })();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{ transactions, createNewTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
