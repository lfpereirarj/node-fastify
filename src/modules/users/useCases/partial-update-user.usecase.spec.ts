import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { InMemoryUsersRepository } from "@/modules/users/repos/memory-users.repository.js";
import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { PartialUpdateUserUseCase } from "@/modules/users/useCases/partial-update-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

describe("Partial Update User UseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: PartialUpdateUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new PartialUpdateUserUseCase(
			usersRepository as unknown as UsersRepository,
		);
	});

	it("should be able to partially update a user name and hash the password if provided", async () => {
		const user = await usersRepository.create({
			name: "John Doe",
			email: "john@patch.com",
			password: "password123",
		});

		const updatedUser = await sut.execute({
			id: user.id,
			name: "John Partial",
			password: "newpassword",
		});

		assert.equal(updatedUser.name, "John Partial");
		assert.equal(updatedUser.email, "john@patch.com");
		assert.equal(updatedUser.password, "newpassword_hashed");
	});

	it("should be able to update name only and preserve the old password untouched", async () => {
		const user = await usersRepository.create({
			name: "Jane Doe",
			email: "jane@patch.com",
			password: "secret_password",
		});

		const updatedUser = await sut.execute({
			id: user.id,
			name: "Jane Updated",
		});

		assert.equal(updatedUser.name, "Jane Updated");
		assert.equal(updatedUser.email, "jane@patch.com");
		assert.equal(updatedUser.password, "secret_password"); // A senha antiga não virou undefined e nem ganhou hash duplo
	});

	it("should not be able to patch a non-existing user", async () => {
		await assert.rejects(
			async () => {
				await sut.execute({
					id: "fake-id",
					name: "Ghost",
				});
			},
			(error: Error) => {
				assert.ok(error instanceof AppError);
				assert.equal(error.statusCode, 404);
				return true;
			},
		);
	});
});
