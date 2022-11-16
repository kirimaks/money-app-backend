"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YupPipe = void 0;
const common_1 = require("@nestjs/common");
const yup_1 = require("yup");
let YupPipe = class YupPipe {
    constructor(objectSchema) {
        this.objectSchema = objectSchema;
    }
    async transform(value, metadata) {
        try {
            await this.objectSchema.validate(value);
        }
        catch (error) {
            if (error instanceof yup_1.ValidationError) {
                for (const errorText of error.errors) {
                    throw new common_1.BadRequestException(errorText);
                }
            }
            throw new common_1.BadRequestException('Validation error');
        }
        return value;
    }
};
YupPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], YupPipe);
exports.YupPipe = YupPipe;
//# sourceMappingURL=yup.pipe.js.map