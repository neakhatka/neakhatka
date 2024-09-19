/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PostJob } from './../../controller/post.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CompanyController } from './../../controller/company.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');
const upload = multer({"limits":{"fileSize":8388608}});



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "postcreateschema": {
        "dataType": "refObject",
        "properties": {
            "logo": {"dataType":"string","required":true},
            "companyName": {"dataType":"string"},
            "workplace": {"dataType":"string"},
            "position": {"dataType":"string"},
            "location": {"dataType":"string"},
            "jobDescription": {"dataType":"array","array":{"dataType":"string"}},
            "jobResponsibilities": {"dataType":"array","array":{"dataType":"string"}},
            "startDate": {"dataType":"string"},
            "endDate": {"dataType":"string"},
            "salary": {"dataType":"string"},
            "totalEmployees": {"dataType":"string"},
            "time": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["full-time"]},{"dataType":"enum","enums":["part-time"]}]},
            "duration": {"dataType":"string"},
            "availablePositions": {"dataType":"string"},
            "gender": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "postupdateschema": {
        "dataType": "refObject",
        "properties": {
            "logo": {"dataType":"string"},
            "companyName": {"dataType":"string"},
            "workplace": {"dataType":"string"},
            "position": {"dataType":"string"},
            "location": {"dataType":"string"},
            "jobDescription": {"dataType":"array","array":{"dataType":"string"}},
            "jobResponsibilities": {"dataType":"array","array":{"dataType":"string"}},
            "startDate": {"dataType":"string"},
            "endDate": {"dataType":"string"},
            "salary": {"dataType":"string"},
            "totalEmployees": {"dataType":"string"},
            "time": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["full-time"]},{"dataType":"enum","enums":["part-time"]}]},
            "duration": {"dataType":"string"},
            "availablePositions": {"dataType":"string"},
            "gender": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "companycreateschema": {
        "dataType": "refObject",
        "properties": {
            "companyname": {"dataType":"string","required":true},
            "contactemail": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/v1/jobs',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.GetAllPosts)),

            async function PostJob_GetAllPosts(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'GetAllPosts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/jobs/:id',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.GetPost)),

            async function PostJob_GetPost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'GetPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/v1/jobs',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.CreatePost)),

            async function PostJob_CreatePost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"postcreateschema"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'CreatePost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/v1/jobs/:id',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.UpdatePost)),

            async function PostJob_UpdatePost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    update: {"in":"body","name":"update","required":true,"ref":"postupdateschema"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'UpdatePost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/v1/jobs/:id',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.DeletePost)),

            async function PostJob_DeletePost(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'DeletePost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/jobs/profile/jobs',
            ...(fetchMiddlewares<RequestHandler>(PostJob)),
            ...(fetchMiddlewares<RequestHandler>(PostJob.prototype.GetPostByCID)),

            async function PostJob_GetPostByCID(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PostJob();

              await templateService.apiHandler({
                methodName: 'GetPostByCID',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/companies',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.GetAll)),

            async function CompanyController_GetAll(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'GetAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/companies/profile',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.GetById)),

            async function CompanyController_GetById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'GetById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/v1/companies',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.CreateCompany)),

            async function CompanyController_CreateCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"companycreateschema"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'CreateCompany',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/v1/companies/profile',
            upload.fields([{"name":"logo","maxCount":1,"multiple":false}]),
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.UpdateCompany)),

            async function CompanyController_UpdateCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    companyname: {"in":"formData","name":"companyname","required":true,"dataType":"string"},
                    contactphone: {"in":"formData","name":"contactphone","required":true,"dataType":"string"},
                    websiteLink: {"in":"formData","name":"websiteLink","required":true,"dataType":"string"},
                    location: {"in":"formData","name":"location","required":true,"dataType":"string"},
                    contactemail: {"in":"formData","name":"contactemail","required":true,"dataType":"string"},
                    contactperson: {"in":"formData","name":"contactperson","required":true,"dataType":"string"},
                    numberOfemployees: {"in":"formData","name":"numberOfemployees","required":true,"dataType":"string"},
                    address: {"in":"formData","name":"address","required":true,"dataType":"string"},
                    companydescription: {"in":"formData","name":"companydescription","required":true,"dataType":"string"},
                    logo: {"in":"formData","name":"logo","dataType":"file"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'UpdateCompany',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/v1/companies/profile',
            ...(fetchMiddlewares<RequestHandler>(CompanyController)),
            ...(fetchMiddlewares<RequestHandler>(CompanyController.prototype.DeleteCompany)),

            async function CompanyController_DeleteCompany(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new CompanyController();

              await templateService.apiHandler({
                methodName: 'DeleteCompany',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
