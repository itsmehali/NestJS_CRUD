import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from '../../user/dto/update-user.dto';

export class UpdateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserDto)
  users?: UpdateUserDto[];
}
