"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: { nome?: string };
  created_at: string;
  last_sign_in_at?: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(`Erro: ${data.error}`);
    } else {
      toast.success("Usuário criado com sucesso!");
      setShowForm(false);
      setNome(""); setEmail(""); setPassword("");
      fetchUsers();
    }
    setSaving(false);
  }

  async function handleDelete(user: SupabaseUser) {
    if (!confirm(`Excluir usuário ${user.email}?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(`Erro: ${data.error}`);
    } else {
      toast.success("Usuário excluído.");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Usuários</h1>
            <p className="text-sm text-zinc-500">{users.length} usuário(s) cadastrado(s)</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 mb-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-zinc-900 mb-2">Novo usuário admin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="João Silva" />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@dgr.com" required />
            </div>
            <div className="space-y-1.5">
              <Label>Senha *</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={saving}>
              {saving ? "Criando..." : "Criar usuário"}
            </Button>
          </div>
        </form>
      )}

      {/* Lista de usuários */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-400">Carregando...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">Nenhum usuário encontrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-slate-50/50">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-zinc-500">Nome</th>
                <th className="text-left px-6 py-3 font-semibold text-zinc-500">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-zinc-500">Criado em</th>
                <th className="text-left px-6 py-3 font-semibold text-zinc-500">Último acesso</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {u.user_metadata?.nome || "—"}
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{u.email}</td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u)}
                      className="text-zinc-400 hover:text-red-600 transition-colors"
                      title="Excluir usuário"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
