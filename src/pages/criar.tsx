   import { useState } from 'react';
   import { trpc } from '../utils/trpc';

   export default function CriarTarefa() {
     const [titulo, setTitulo] = useState('');
     const [descricao, setDescricao] = useState('');
     const criarTask = trpc.tasks.criar.useMutation();

     function handleSubmit(e: React.FormEvent) {
       e.preventDefault();
       criarTask.mutate({ titulo, descricao });
     }

     return (
       <form onSubmit={handleSubmit} className="p-6">
         <input
           type="text"
           placeholder="Título"
           value={titulo}
           onChange={(e) => setTitulo(e.target.value)}
           required
         />
         <textarea
           placeholder="Descrição"
           value={descricao}
           onChange={(e) => setDescricao(e.target.value)}
         />
         <button type="submit" className="mt-2 btn">
           Criar Tarefa
         </button>
       </form>
     );
   }