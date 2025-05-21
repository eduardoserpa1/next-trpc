import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

interface Task {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: Date;
}

const taskList: Task[] = [];

export const tasksRouter = router({
    criar: publicProcedure
        .input(
            z.object({
                titulo: z.string().nonempty('O título é obrigatório'),
                descricao: z.string().optional(),
            })
        )
        .mutation(({ input }) => {
            const novaTarefa: Task = {
                id: (Math.random() * 1000).toFixed(0),
                titulo: input.titulo,
                descricao: input.descricao,
                dataCriacao: new Date(),
            };
            taskList.push(novaTarefa);
            return novaTarefa;
        }),

    listar: publicProcedure.query(() => {
        return taskList;
    }),

    atualizar: publicProcedure
        .input(
            z.object({
                id: z.string(),
                titulo: z.string().optional(),
                descricao: z.string().optional(),
            })
        )
        .mutation(({ input }) => {
            const task = taskList.find((task) => task.id === input.id);
            if (!task) throw new Error('Tarefa não encontrada');

            if (input.titulo) task.titulo = input.titulo;
            if (input.descricao) task.descricao = input.descricao;

            return task;
        }),

    deletar: publicProcedure
        .input(z.string())
        .mutation(({ input: id }) => {
            const indice = taskList.findIndex((task) => task.id === id);
            if (indice === -1) throw new Error('Tarefa não encontrada');
            taskList.splice(indice, 1);
            return { mensagem: 'Tarefa removida com sucesso' };
        }),
});