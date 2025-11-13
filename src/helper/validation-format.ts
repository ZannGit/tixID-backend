import { BadRequestException, ValidationError } from "@nestjs/common";

const FormatValidation = (errors: ValidationError[]): BadRequestException => {
    const message = errors.map(
        it => Object.values(it.constraints || {}).join(', ')
    )
        .join("; ")
    return new BadRequestException(`error validation: ${message}`);
}
export default FormatValidation;