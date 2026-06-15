import type { FastifyInstance } from "fastify";
import { UsersRepository } from "../repos/users.repository.js";
import { CreateUserUseCase } from "../useCases/create-user.usecase.js";
import { DeleteUserUseCase } from "../useCases/delete-user.usecase.js";
import { ListUsersUseCase } from "../useCases/list-users.usecases.js";
import { PartialUpdateUserUseCase } from "../useCases/partial-update-user.usecase.js";
import { UpdateUserUseCase } from "../useCases/update-user.usecase.js";

import {
	type CreateUserBody,
	createUserBodySchema,
	createUserResponseErrorSchema,
	createUserResponseSuccessSchema,
	type DeleteUserParams,
	deleteUserErrorResponseSchema,
	deleteUserParamsSchema,
	deleteUserSuccessResponseSchema,
	listUsersResponseSuccessSchema,
	type PartialUpdateUserBody,
	type PartialUpdateUserParams,
	partialUpdateUserBodySchema,
	partialUpdateUserParamsSchema,
	partialUpdateUserResponseErrorSchema,
	partialUpdateUserResponseSuccessSchema,
	type UpdateUserBody,
	type UpdateUserParams,
	updateUserBodySchema,
	updateUserParamsSchema,
	updateUserResponseErrorSchema,
	updateUserResponseSuccessSchema,
} from "./users.schema.js";

export async function usersRoutes(app: FastifyInstance) {
	const usersRepository = new UsersRepository();

	app.get(
		"/users",
		{
			schema: {
				tags: ["Users"],
				summary: "Listar todos os usuários",
				response: {
					200: listUsersResponseSuccessSchema,
				},
			},
		},
		async (_request, reply) => {
			const listUsersUseCase = new ListUsersUseCase(usersRepository);
			const users = await listUsersUseCase.execute();
			return reply.status(200).send({ users });
		},
	);

	app.post(
		"/users",
		{
			schema: {
				tags: ["Users"],
				summary: "Criar um novo usuário",
				body: createUserBodySchema,
				response: {
					201: createUserResponseSuccessSchema,
					409: createUserResponseErrorSchema,
				},
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body as CreateUserBody;

			const createUserUseCase = new CreateUserUseCase(usersRepository);
			const user = await createUserUseCase.execute({ name, email, password });

			return reply.status(201).send({ user });
		},
	);

	app.put(
		"/users/:id",
		{
			schema: {
				tags: ["Users"],
				summary: "Atualizar dados de um usuário (PUT)",
				params: updateUserParamsSchema,
				body: updateUserBodySchema,
				response: {
					200: updateUserResponseSuccessSchema,
					404: updateUserResponseErrorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as UpdateUserParams;
			const { name, email, password } = request.body as UpdateUserBody;

			const updateUserUseCase = new UpdateUserUseCase(usersRepository);
			const user = await updateUserUseCase.execute({
				id,
				name,
				email,
				password,
			});

			return reply.status(200).send({ user });
		},
	);

	app.patch(
		"/users/:id",
		{
			schema: {
				tags: ["Users"],
				summary: "Atualizar dados parciais de um usuário (PATCH)",
				params: partialUpdateUserParamsSchema,
				body: partialUpdateUserBodySchema,
				response: {
					201: partialUpdateUserResponseSuccessSchema,
					409: partialUpdateUserResponseErrorSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as PartialUpdateUserParams;
			const bodyData = request.body as PartialUpdateUserBody;

			const partialUpdateUserUseCase = new PartialUpdateUserUseCase(
				usersRepository,
			);
			const user = await partialUpdateUserUseCase.execute({ id, ...bodyData });

			return reply.status(200).send({ user });
		},
	);

	app.delete(
		"/users/:id",
		{
			schema: {
				tags: ["Users"],
				summary: "Remover um usuário",
				params: deleteUserParamsSchema,
				response: {
					204: deleteUserSuccessResponseSchema,
					404: deleteUserErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as DeleteUserParams;

			const deleteUserUseCase = new DeleteUserUseCase(usersRepository);
			await deleteUserUseCase.execute(id);
			return reply.status(204).send();
		},
	);
}
