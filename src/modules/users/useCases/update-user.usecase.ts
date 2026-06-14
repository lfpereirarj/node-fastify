import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { AppError } from "@/shared/errors/app-error.js";

interface UpdateUserRequest {
	id: string;
	name: string;
	email: string;
	password: string;
}

export class UpdateUserUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute(data: UpdateUserRequest) {
		const { id, name, email, password } = data;
		const userExists = await this.userRepository.findById(id);

		if (!userExists) {
			throw new AppError("User not found", 404);
		}

		const hashedPassword = `${password}_hashed`;

		const updateUser = await this.userRepository.update(id, {
			name,
			email,
			password: hashedPassword,
		});

		return updateUser;
	}
}
