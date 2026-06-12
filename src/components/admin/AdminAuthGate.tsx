import { useState, useEffect, type ReactNode } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuroraLogo from '../ui/AuroraLogo';

const SESSION_KEY = 'aurora_admin_authed';

// ─────────────────────────────────────────────────────────
//  SENHA DO ADMIN
//  Altere a senha abaixo para a que desejar.
//  Dica: use algo que só você e a dona da loja saibam.
// ─────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'aurora2026';

const AdminAuthGate = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setAuthed(true);
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!checked) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-marrom bg-texture flex items-center justify-center px-4">
      <div className="bg-bege w-full max-w-sm p-8 shadow-soft-lg">
        <div className="flex flex-col items-center mb-6">
          <AuroraLogo variant="full" color="dark" size="sm" />
        </div>

        <div className="flex items-center justify-center w-12 h-12 border border-dourado/40 mx-auto mb-4">
          <Lock size={20} className="text-dourado" />
        </div>

        <h1 className="font-display text-2xl font-light text-marrom text-center mb-2">
          Área Restrita
        </h1>
        <p className="font-body text-sm text-marrom/50 text-center mb-6">
          Digite a senha de administrador para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Senha"
              autoFocus
              className={`input-field pr-10 ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-marrom/40 hover:text-marrom transition-colors"
              aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center">Senha incorreta. Tente novamente.</p>
          )}

          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthGate;
