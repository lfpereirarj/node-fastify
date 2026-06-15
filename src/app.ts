// src/app.ts
import fastify from "fastify";
import { z } from "zod";
import { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { CreateUserUseCase } from "@/modules/users/useCases/create-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

export const app = fastify({ logger: false });

const usersRepository = new UsersRepository();

app.post("/users", async (request, reply) => {
	const createUserSchema = z.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = createUserSchema.parse(request.body);

	const createUserUseCase = new CreateUserUseCase(usersRepository);
	const user = await createUserUseCase.execute({ name, email, password });

	return reply.status(201).send({ user });
});

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
