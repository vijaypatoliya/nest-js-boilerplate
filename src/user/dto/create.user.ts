import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty()
  readonly userName: string;

  @ApiModelProperty()
  @IsEmail()
  emailAddress: string;

  @ApiModelProperty()
  @MinLength(8)
  password: string;
}