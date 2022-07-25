import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { PrismaClient } from "@prisma/client";

interface PrismaSetDTO {
    name: string;
    description: string;
}

interface PrismaUpdateDTO {
    id: number;
    data: PrismaSetDTO;
}

interface PrismaIdDTO {
    id: number;
}

@Controller({ route: "/api/prisma" })
export class PrimsaController extends ApiController {
    private prisma;

    constructor() {
        super();
        this.prisma = new PrismaClient();
    }

    @Action({ route: "/" })
    async get(): Promise<any> {
        try {
            const allRoles = await this.prisma.role.findMany();
            console.log(allRoles);
            this.httpContext.response.sendStatus(200);
            return;
        } catch (e) {
            this.httpContext.response.sendStatus(500);
        } finally {
            await this.prisma.$disconnect();
            return;
        }
    }

    @Action({ route: "/:id" })
    async getById(id: number): Promise<any> {
        try {
            if (id) {
                const role = await this.prisma.role.findFirst({
                    where: {
                        id: id,
                    },
                });
                console.log(role);
                this.httpContext.response.sendStatus(200);
                return;
            } else {
                this.httpContext.response.sendStatus(400);
            }
        } catch (e) {
            this.httpContext.response.sendStatus(500);
        } finally {
            await this.prisma.$disconnect();
            return;
        }
    }

    @Action({ route: "/", method: HttpMethod.POST })
    async set(): Promise<any> {
        let dto: PrismaSetDTO = this.httpContext.request.body;
        let { name, description } = dto;
        try {
            if (name && description) {
                await this.prisma.role.create({
                    data: {
                        name: name,
                        description: description,
                    },
                });
                const allRoles = await this.prisma.role.findMany();
                console.log(allRoles);
                this.httpContext.response.sendStatus(200);
            } else {
                this.httpContext.response.sendStatus(400);
            }
        } catch (e) {
            console.log(e);
            this.httpContext.response.sendStatus(500);
        } finally {
            await this.prisma.$disconnect();
            return;
        }
    }

    @Action({ route: "/", method: HttpMethod.PUT })
    async update(): Promise<any> {
        try {
            let dto: PrismaUpdateDTO = this.httpContext.request.body;
            let { id, data } = dto;
            if (id && data && data.name && data.description) {
                await this.prisma.role.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: data.name,
                        description: data.description,
                    },
                });
                const allRoles = await this.prisma.role.findMany();
                console.log(allRoles);
                this.httpContext.response.sendStatus(200);
            } else {
                this.httpContext.response.sendStatus(400);
            }
        } catch (e) {
            console.log(e);
            this.httpContext.response.sendStatus(500);
        } finally {
            await this.prisma.$disconnect();
            return;
        }
    }

    @Action({ route: "/", method: HttpMethod.DELETE })
    async delete(): Promise<any> {
        try {
            let dto: PrismaIdDTO = this.httpContext.request.body;
            let { id } = dto;
            if (id) {
                await this.prisma.role.delete({
                    where: {
                        id: id,
                    },
                });
                const allRoles = await this.prisma.role.findMany();
                console.log(allRoles);
                this.httpContext.response.sendStatus(200);
            } else {
                this.httpContext.response.sendStatus(400);
            }
        } catch (e) {
            console.log(e);
            this.httpContext.response.sendStatus(500);
        } finally {
            await this.prisma.$disconnect();
            return;
        }
    }
}
