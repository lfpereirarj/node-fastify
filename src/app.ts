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
import { usersRoutes } from "@/modules/users/http/users.routes.js";

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

await app.register(usersRoutes);

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
