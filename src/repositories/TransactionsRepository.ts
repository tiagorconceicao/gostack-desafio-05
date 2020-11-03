import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  private getIncome(): number {
    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    const income = incomeTransactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.value;
    }, 0);

    return income;
  }

  private getOutcome(): number {
    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const outcome = incomeTransactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.value;
    }, 0);

    return outcome;
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.getIncome();
    const outcome = this.getOutcome();

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('This outcome value is not available');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
