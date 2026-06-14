import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { AppError } from "@/shared/errors/app-error.js";

interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

export class CreateUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(data: CreateUserRequest) {
		const { name, email, password } = data;
		const userAlreadyExists = await this.usersRepository.findByEmail(email);

		if (userAlreadyExists) {
			throw new AppError("E-mail already exists");
		}

		const hashedPassword = `${password}_hashed`;

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return user;
	}
}
