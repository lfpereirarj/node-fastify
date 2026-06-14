import type { UsersRepository } from "@/modules/users/repos/users.repository.js";

export class ListUsersUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute() {
		const users = await this.usersRepository.findAll();
		return users;
	}
}
