import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { InMemoryUsersRepository } from "@/modules/users/repos/memory-users.repository.js";
import { ListUsersUseCase } from "@/modules/users/useCases/list-users.usecases.js"; // Ajuste o nome se estiver no singular

describe("List Users UseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: ListUsersUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new ListUsersUseCase(usersRepository as any);
	});

	it("should be able to list all users", async () => {
		// Injetamos dois usuários no banco falso
		await usersRepository.create({
			name: "John",
			email: "john@test.com",
			password: "123",
		});
		await usersRepository.create({
			name: "Jane",
			email: "jane@test.com",
			password: "123",
		});

		const users = await sut.execute();

		assert.equal(users.length, 2);
		assert.equal(users[0].name, "John");
	});
});
