import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    const transactionsAndBalance = {
      transactions,
      balance,
    };

    return response.json(transactionsAndBalance);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  const { title, value, type } = request.body;

  const createTransaction = new CreateTransactionService(
    transactionsRepository,
  );

  try {
    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
