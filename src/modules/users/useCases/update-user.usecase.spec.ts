import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { InMemoryUsersRepository } from "@/modules/users/repos/memory-users.repository.js";
import { UpdateUserUseCase } from "@/modules/users/useCases/update-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

describe("Update User UseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: UpdateUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new UpdateUserUseCase(usersRepository as any);
	});

	it("should be able to update a user", async () => {
		const user = await usersRepository.create({
			name: "John Doe",
			email: "john@test.com",
			password: "123",
		});

		const updatedUser = await sut.execute({
			id: user.id,
			name: "John Updated",
			email: "john@test.com",
			password: "123",
		});

		assert.equal(updatedUser.name, "John Updated");
		assert.equal(usersRepository.items[0].name, "John Updated");
	});

	it("should not be able to update a non-existing user", async () => {
		await assert.rejects(
			async () => {
				await sut.execute("fake-id", { name: "Ghost" });
			},
			(error: Error) => {
				assert.ok(error instanceof AppError);
				assert.equal(error.statusCode, 404);
				return true;
			},
		);
	});
});
