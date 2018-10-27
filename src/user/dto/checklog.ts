import { ApiModelProperty } from '@nestjs/swagger';

export class CheckLog {
  @ApiModelProperty()
  readonly token: string;
}