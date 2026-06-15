import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { InMemoryUsersRepository } from "@/modules/users/repos/memory-users.repository.js";
import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { CreateUserUseCase } from "@/modules/users/useCases/create-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

describe("Create User UseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: CreateUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();

		sut = new CreateUserUseCase(usersRepository as unknown as UsersRepository);
	});

	it("should be able to create a new user", async () => {
		const user = await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "password123",
		});

		assert.ok(user.id);
		assert.equal(user.name, "John Doe");

		assert.equal(usersRepository.items.length, 1);
	});

	it("should not be able to create a user with duplicate email", async () => {
		await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "password123",
		});

		await assert.rejects(
			async () => {
				await sut.execute({
					name: "Jane Doe",
					email: "john@example.com",
					password: "123",
				});
			},
			(error: Error) => {
				assert.ok(error instanceof AppError);
				assert.equal(error.message, "E-mail already exists");
				return true;
			},
		);
	});
});
