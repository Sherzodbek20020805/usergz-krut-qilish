import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserImageDto {
    @ApiProperty({
        type: "string",
        format: "binary",
        required: true,
    })
    image: Express.Multer.File
}