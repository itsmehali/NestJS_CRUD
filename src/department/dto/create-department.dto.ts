import { IsNotEmpty, IsString, IsDate, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Type } from 'class-transformer';
import { DepartmentDataDto } from './department.dto';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DepartmentDataDto)
  departments: DepartmentDataDto[];
}
