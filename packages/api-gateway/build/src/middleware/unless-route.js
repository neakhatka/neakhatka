"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unless(conditions, middleware) {
    return (req, res, next) => {
        const shouldSkip = conditions.some((condition) => {
            const pathMatches = typeof condition.path === "string"
                ? req.path.startsWith(condition.path)
                : condition.path.test(req.path); // Use RegExp test method if path is a regex
            console.log(`Request#####`, pathMatches);
            console.log(`Request#####`, req.path);
            const methodMatches = !condition.method || req.method === condition.method;
            console.log(`Request#####`, methodMatches);
            return pathMatches && methodMatches;
        });
        console.log(`Request#####`, shouldSkip);
        if (shouldSkip) {
            return next();
        }
        else {
            middleware(req, res, next);
        }
    };
}
exports.default = unless;
//# sourceMappingURL=unless-route.js.map