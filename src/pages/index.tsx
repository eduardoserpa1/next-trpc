import { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function Home() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tarefaEditando, setTarefaEditando] = useState(null);
    const { data: tasks, refetch } = trpc.tasks.listar.useQuery();
    const criarTask = trpc.tasks.criar.useMutation({
        onSuccess: () => {
            refetch();
            setTitulo('');
            setDescricao('');
        },
    });
    const atualizarTask = trpc.tasks.atualizar.useMutation({
        onSuccess: () => {
            refetch();
            setTitulo('');
            setDescricao('');
            setTarefaEditando(null);
        },
    });
    const deletarTask = trpc.tasks.deletar.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!titulo) return;
        if (tarefaEditando) {
            atualizarTask.mutate({
                id: tarefaEditando.id,
                titulo,
                descricao,
            });
        } else {
            criarTask.mutate({ titulo, descricao });
        }
    }

    function handleEdit(task: { id: string; titulo: string; descricao: string }) {
        setTarefaEditando(task);
        setTitulo(task.titulo);
        setDescricao(task.descricao || '');
    }

    function handleCancelEdit() {
        setTarefaEditando(null);
        setTitulo('');
        setDescricao('');
    }

    function handleDelete(id: string) {
        deletarTask.mutate(id);
    }

    return (
        <main className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Lista de Tarefas</h1>

            <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded-lg flex flex-col gap-4 border border-gray-200">
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
                />
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 active:bg-blue-700 transition duration-200 flex-1"
                    >
                        {tarefaEditando ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                    </button>
                    {tarefaEditando && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white p-3 rounded-md font-semibold hover:bg-gray-600 active:bg-gray-700 transition duration-200 flex-1"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <ul className="mt-6">
                {tasks?.map((task) => (
                    <li
                        key={task.id}
                        className="flex justify-between items-center border-b border-gray-200 p-3 hover:bg-gray-50 transition duration-150"
                    >
                        <div>
                            <p className="font-semibold text-lg text-gray-800">{task.titulo}</p>
                            <p className="text-sm text-gray-600">{task.descricao || 'Sem descrição'}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(task.dataCriacao).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(task)}
                                className="font-semibold text-white bg-yellow-500 px-3 py-2 rounded-md hover:bg-yellow-600 active:bg-yellow-700 transition duration-200"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="font-semibold text-white bg-red-500 px-3 py-2 rounded-md hover:bg-red-600 active:bg-red-700 transition duration-200"
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}