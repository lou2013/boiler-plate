import { ApiProperty } from '@nestjs/swagger';
class infoObject {
  @ApiProperty({
    description: 'the property which the error occured on',
    example: 'phoneNumber',
  })
  property: string;

  @ApiProperty({
    description: 'an array of errors ',
    example: ['phoneNumer must be a phoneNumber'],
    type: [String],
  })
  errors: string[];
}
class insideError {
  @ApiProperty({
    type: [infoObject],
    description: 'normally appears when its a validation error',
  })
  fields: [infoObject];

  @ApiProperty({
    description:
      'the status code of the error which is 400 for validation errors',
    example: 400,
  })
  status: number;

  @ApiProperty({
    description: 'the message realted to the error',
    example: 'not found',
  })
  message: string;
}

export class serverErrorDto {
  @ApiProperty({ type: insideError })
  serverError: insideError;
}
