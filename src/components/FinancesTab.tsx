import { useState } from 'react';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Business', 'Health', 'Other'];

export default function FinancesTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newCat, setNewCat] = useState('Other');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  const net = totalIncome - totalExpenses;

  const addTransaction = () => {
    if (!newDesc.trim() || !newAmount) return;
    const amt = parseFloat(newAmount);
    setTransactions(prev => [{
      id: Date.now().toString(),
      description: newDesc.trim(),
      amount: newType === 'expense' ? -Math.abs(amt) : Math.abs(amt),
      category: newCat,
      date: 'Today',
      type: newType,
    }, ...prev]);
    setNewDesc('');
    setNewAmount('');
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 pb-4">
      <div className="px-4 pt-4">
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 4 }}>
          Finances
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e8e8e8', letterSpacing: '-0.02em' }}>
          Money tracker
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>Income</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>${totalIncome.toFixed(0)}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>Expenses</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>${totalExpenses.toFixed(0)}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: 9, color: '#888', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>Net</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: net >= 0 ? '#22c55e' : '#ef4444' }}>
            {net >= 0 ? '+' : ''}{net.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="mx-4 rounded-xl p-4" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase', marginBottom: 12 }}>
          Add transaction
        </div>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setNewType('expense')}
            className="flex-1 rounded-lg py-2 text-sm font-semibold"
            style={{ background: newType === 'expense' ? 'rgba(239,68,68,0.15)' : '#1a1a1a', border: `1px solid ${newType === 'expense' ? '#ef4444' : '#2a2a2a'}`, color: newType === 'expense' ? '#ef4444' : '#666' }}
          >
            Expense
          </button>
          <button
            onClick={() => setNewType('income')}
            className="flex-1 rounded-lg py-2 text-sm font-semibold"
            style={{ background: newType === 'income' ? 'rgba(34,197,94,0.15)' : '#1a1a1a', border: `1px solid ${newType === 'income' ? '#22c55e' : '#2a2a2a'}`, color: newType === 'income' ? '#22c55e' : '#666' }}
          >
            Income
          </button>
        </div>
        <input
          type="text"
          placeholder="Description..."
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          className="w-full rounded-xl px-3 py-2 mb-2 outline-none"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 13 }}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount..."
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 13 }}
          />
          <select
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="rounded-xl px-3 py-2 outline-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: 12 }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button
            onClick={addTransaction}
            className="rounded-xl px-4 py-2 font-bold"
            style={{ background: '#e8e8e8', color: '#0a0a0a', fontSize: 13 }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4">
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', marginBottom: 10 }}>
          Transactions
        </div>
        <div className="flex flex-col gap-2">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: '#111', border: '1px solid #1e1e1e' }}
            >
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 32, height: 32,
                  background: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                }}
              >
                {tx.type === 'income'
                  ? <TrendingUp size={14} color="#22c55e" />
                  : <TrendingDown size={14} color="#ef4444" />
                }
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 13, fontWeight: 500, color: '#d0d0d0' }}>{tx.description}</div>
                <div style={{ fontSize: 10, color: '#555' }}>{tx.category} · {tx.date}</div>
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: tx.type === 'income' ? '#22c55e' : '#ef4444',
              }}>
                {tx.type === 'income' ? '+' : ''}{tx.amount < 0 ? tx.amount : `+${tx.amount}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
