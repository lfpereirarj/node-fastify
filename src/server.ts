import { fastify } from "fastify";
import { z } from "zod";
import { UsersRepository } from "./modules/users/repos/users.repository";
import { CreateUserUseCase } from "./modules/users/useCases/create-user.usecase";
import { DeleteUserUseCase } from "./modules/users/useCases/delete-user.usecase";
import { ListUsersUseCase } from "./modules/users/useCases/list-users.usecases";
import { UpdateUserUseCase } from "./modules/users/useCases/update-user.usecase";

const app = fastify({ logger: true });

const usersRepository = new UsersRepository();

interface UserRouteParams {
	id: string;
}

app.get("/users", async (_, reply) => {
	const listUsersUseCase = new ListUsersUseCase(usersRepository);
	const users = await listUsersUseCase.execute();

	return reply.status(200).send({ users });
});

app.post("/users", async (request, reply) => {
	const createUserSchema = z.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
	});

	try {
		const { name, email, password } = createUserSchema.parse(request.body);
		const createUserUseCase = new CreateUserUseCase(usersRepository);
		const user = await createUserUseCase.execute({ name, email, password });

		return reply.status(201).send({ user });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return reply
				.status(400)
				.send({ error: "Validation Error", issues: error.format() });
		}
		if (error.message === "E-mail already exists") {
			return reply.status(409).send({ error: error.message });
		}
		app.log.error(error);
		return reply.status(500).send({ error: "Internal Server Error" });
	}
});

app.put<{ Params: UserRouteParams }>("/users/:id", async (request, reply) => {
	const { id } = request.params;

	const updateUserSchema = z.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
	});

	try {
		const { name, email, password } = updateUserSchema.parse(request.body);
		const updateUserUseCase = new UpdateUserUseCase(usersRepository);
		const user = await updateUserUseCase.execute({
			id,
			name,
			email,
			password,
		});

		return reply.status(200).send({ user });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return reply
				.status(400)
				.send({ error: "Validation Error", issues: error.format() });
		}

		if (error.message === "User not found") {
			return reply.status(404).send({ error: error.message });
		}
		app.log.error(error);
		return reply.status(500).send({ error: "Internal Server Error" });
	}
});

app.delete<{ Params: UserRouteParams }>(
	"/users/:id",
	async (request, reply) => {
		const { id } = request.params;

		try {
			const deleteUserUseCase = new DeleteUserUseCase(usersRepository);
			await deleteUserUseCase.execute(id);

			return reply.status(200).send({ message: "User Delete!!" });
		} catch (error: any) {
			if (error.message === "User not found") {
				return reply.status(404).send({ error: error.message });
			}
			app.log.error(error);
			return reply.status(500).send({ error: "Internal Server Error" });
		}
	},
);

const start = async () => {
	try {
		await app.listen({ port: 3333, host: "0.0.0.0" });
		console.log("🚀 Server is running on http://localhost:3333");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
