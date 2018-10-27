import { ApiModelProperty } from '@nestjs/swagger';

export class Credentials {
  @ApiModelProperty()
  readonly userName: string;

  @ApiModelProperty()
  readonly password: string;
}