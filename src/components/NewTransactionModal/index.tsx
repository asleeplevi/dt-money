import ReactModal from "react-modal";
import incomeImg from "../../assets/income.svg";
import outcomeImg from "../../assets/outcome.svg";
import { Container, RadioBox, TransactionTypeContainer } from "./styles";
import closeImg from "../../assets/close.svg";
import { FormEvent, useContext, useState } from "react";
import { api } from "../../services/api";
import { TransactionsContext } from "../../contexts/TransactionsContext";

interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [type, setType] = useState("deposit");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);

  const { createNewTransaction } = useContext(TransactionsContext);

  async function handleCreateNewTransaction(e: FormEvent) {
    e.preventDefault();

    const props = {
      title,
      category,
      amount,
      type,
    };

    try {
      const { data } = await api.post("/transactions", props);
      createNewTransaction(data.transaction);
      setTitle("");
      setType("deposit");
      setCategory("");
      setAmount(0);
      onRequestClose();
    } catch (error) {}
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
      >
        <img src={closeImg} alt="Fechar modal" />
      </button>
      <Container onSubmit={handleCreateNewTransaction}>
        <h2>Cadastrar transação</h2>
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Titulo"
          type="text"
        />
        <input
          value={amount}
          onChange={({ target }) => setAmount(Number(target.value))}
          placeholder="Valor"
          type="number"
        />
        <input
          value={category}
          onChange={({ target }) => setCategory(target.value)}
          placeholder="Categoria"
        />

        <TransactionTypeContainer>
          <RadioBox
            type="button"
            onClick={() => setType("deposit")}
            isActive={type === "deposit"}
            activeColor="green"
          >
            <img src={incomeImg} alt="Entrada" />
            <span>Entrada</span>
          </RadioBox>
          <RadioBox
            type="button"
            isActive={type === "withdraw"}
            activeColor="red"
            onClick={() => setType("withdraw")}
          >
            <img src={outcomeImg} alt="Saída" />
            <span>Saída</span>
          </RadioBox>
        </TransactionTypeContainer>
        <button type="submit">Cadastrar</button>
      </Container>
    </ReactModal>
  );
};
export default NewTransactionModal;
