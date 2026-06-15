// src/app.ts

import swagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { CreateUserUseCase } from "@/modules/users/useCases/create-user.usecase.js";
import { DeleteUserUseCase } from "@/modules/users/useCases/delete-user.usecase.js";
import { ListUsersUseCase } from "@/modules/users/useCases/list-users.usecases.js";
import { PartialUpdateUserUseCase } from "@/modules/users/useCases/partial-update-user.usecase.js";
import { UpdateUserUseCase } from "@/modules/users/useCases/update-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

export const app = fastify({ logger: false });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(swagger, {
	openapi: {
		info: {
			title: "Node Fastify Boilerplate API",
			description:
				"Documentação completa do nosso boilerplate em Clean Architecture",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

await app.register(fastifyApiReference, {
	routePrefix: "/docs",
	configuration: {
		spec: {
			content: () => app.swagger(),
		},
		theme: "purple",
		showModels: true,
	},
});

const usersRepository = new UsersRepository();

const createUserBodySchema = z.object({
	name: z.string().min(3).describe("Nome do usuário"),
	email: z.string().email().describe("E-mail único"),
	password: z.string().min(6).describe("Senha de acesso"),
});

app.post(
	"/users",
	{
		schema: {
			tags: ["Users"],
			summary: "Criar um novo usuário",
			body: createUserBodySchema,
			response: {
				201: z.object({ user: z.any() }),
				409: z.object({ message: z.string() }),
			},
		},
	},
	async (request, reply) => {
		const createUserSchema = z.object({
			name: z.string().min(3),
			email: z.string().email(),
			password: z.string().min(6),
		});

		const { name, email, password } = createUserSchema.parse(request.body);

		const createUserUseCase = new CreateUserUseCase(usersRepository);
		const user = await createUserUseCase.execute({ name, email, password });

		return reply.status(201).send({ user });
	},
);

app.get(
	"/users",
	{
		schema: {
			tags: ["Users"],
			summary: "Listar todos os usuários",
			response: {
				200: z
					.object({
						users: z.array(z.any()),
					})
					.describe("Lista de usuários cadastrados"),
			},
		},
	},
	async (_request, reply) => {
		const listUsersUseCase = new ListUsersUseCase(usersRepository);
		const users = await listUsersUseCase.execute();
		return reply.status(200).send({ users });
	},
);

const updateUserParamsSchema = z.object({
	id: z.string().uuid().describe("ID do usuário"),
});

const updateUserBodySchema = z.object({
	name: z.string().min(3).describe("Nome do usuário"),
	email: z.string().email().describe("E-mail único"),
	password: z.string().min(6).describe("Senha de acesso"),
});

app.put(
	"/users/:id",
	{
		schema: {
			tags: ["Users"],
			summary: "Atualizar dados de um usuário (PUT)",
			params: updateUserParamsSchema,
			body: updateUserBodySchema,
			response: {
				200: z
					.object({ user: z.any() })
					.describe("Usuário atualizado com sucesso"),
				404: z
					.object({ message: z.string() })
					.describe("Usuário não encontrado"),
			},
		},
	},
	async (request, reply) => {
		const { id } = updateUserParamsSchema.parse(request.params);
		const { name, email, password } = updateUserBodySchema.parse(request.body);

		const updateUserUseCase = new UpdateUserUseCase(usersRepository);
		const user = await updateUserUseCase.execute({ id, name, email, password });

		return reply.status(200).send({ user });
	},
);

const partialUpdateUserBodySchema = z.object({
	name: z.string().min(3).describe("Nome do usuário").optional(),
	email: z.string().email().describe("E-mail único").optional(),
	password: z.string().min(6).describe("Senha de acesso").optional(),
});

app.patch(
	"/users/:id",
	{
		schema: {
			tags: ["Users"],
			summary: "Atualizar dados parciais de um usuário (PATCH)",
			params: partialUpdateUserBodySchema,
			body: updateUserBodySchema,
			response: {
				200: z
					.object({ user: z.any() })
					.describe("Usuário atualizado com sucesso"),
				404: z
					.object({ message: z.string() })
					.describe("Usuário não encontrado"),
			},
		},
	},
	async (request, reply) => {
		const { id } = updateUserParamsSchema.parse(request.params);
		const userData = partialUpdateUserBodySchema.parse(request.body);

		const partialUpdateUserUseCase = new PartialUpdateUserUseCase(
			usersRepository,
		);
		const user = await partialUpdateUserUseCase.execute({ id, ...userData });

		return reply.status(200).send({ user });
	},
);

const deleteUserParamsSchema = z.object({
	id: z.string().uuid().describe("ID do usuário a ser removido"),
});

app.delete(
	"/users/:id",
	{
		schema: {
			tags: ["Users"],
			summary: "Remover um usuário",
			params: deleteUserParamsSchema,
			response: {
				204: z.null().describe("Usuário removido com sucesso"),
				404: z
					.object({ message: z.string() })
					.describe("Usuário não encontrado"),
			},
		},
	},
	async (request, reply) => {
		const { id } = deleteUserParamsSchema.parse(request.params);
		const deleteUserUseCase = new DeleteUserUseCase(usersRepository);
		await deleteUserUseCase.execute(id);
		return reply.status(204).send();
	},
);

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof z.ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({ message: error.message });
	}

	console.error(error);
	return reply.status(500).send({ message: "Internal server error." });
});
